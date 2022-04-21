import {Request, RequestRepositoryEvent} from "renderer/repository/RequestRepository";
import {EventEmitter} from "events";
import {DataChannel, PeerConnectionEvent} from "renderer/helpers/WebrtcHelper";
import WebsocketHelper, {DroplyResponse, DroplyUpdate} from "renderer/helpers/WebsocketHelper";
import {AuthRepository} from "renderer/repository/AuthRepository";

/**
 * "request/signal" method
 */

const REQUEST_SIGNAL_PATH = "request/signal"

interface RequestSignalRequest {
    requestId: number,
    content: string
}

interface RequestSignalResponse extends DroplyResponse {
}

/**
 * "REQUEST_SIGNAL" update
 */

const REQUEST_SIGNAL_UPDATE_TYPE = "REQUEST_SIGNAL"

interface RequestSignalContent {
    requestId: number,

    // WebRTC data
    content: string
}

const TRANSFER_DELETE_TIMEOUT = 2000

export enum TransferRepositoryEvent {
    UPDATE = "update"
}

export class TransferRepository extends EventEmitter {
    public static Instance = new TransferRepository()

    private transfers: { [id: string]: Transfer } = {}

    constructor() {
        super();
        this.setHandlers()
    }

    public async createTransfer(request: Request) {
        let transfer = new Transfer(request)
        this.addTransfer(transfer)

        transfer.on(TransferEvent.UPDATE, () => {
            this.emit(TransferRepositoryEvent.UPDATE)

            if (transfer.state == TransferState.DONE) {
                setTimeout(
                    this.deleteRequest.bind(this),
                    TRANSFER_DELETE_TIMEOUT,
                    transfer.request.id
                )
            }
        })

        await transfer.process()
    }

    public list(): Transfer[] {
        return Object.values(this.transfers)
    }

    private async handleSignaling(update: DroplyUpdate<RequestSignalContent>) {
        let transfer = this.getTransfer(update.content.requestId)
        if (transfer == null) {
            return
        }

        await transfer.addCandidate(update.content.content)
    }

    private addTransfer(transfer: Transfer) {
        this.transfers[transfer.request.id] = transfer

        // Transfer map updated
        this.emit(TransferRepositoryEvent.UPDATE)
    }

    private getTransfer(requestId: number): Transfer {
        let transfer = this.transfers[requestId]

        return transfer ? transfer : null
    }

    private deleteRequest(requestId: number) {
        delete this.transfers[requestId]

        // Transfer map updated
        this.emit(RequestRepositoryEvent.UPDATE)
    }

    private setHandlers() {
        WebsocketHelper.Instance
            .on(REQUEST_SIGNAL_UPDATE_TYPE, this.handleSignaling.bind(this))
    }
}

export enum TransferEvent {
    UPDATE = "update"
}

export enum TransferState {
    EXCHANGING,
    ACTIVE,
    ERROR,
    DONE
}

export class Transfer extends EventEmitter {
    public request: Request

    public state = TransferState.EXCHANGING

    private receivedFiles = 0

    constructor(request: Request) {
        super()
        this.request = request

        this.setHandlers()
    }

    public async addCandidate(candidate: string) {
        await this.request.peerConnection.addCandidate(candidate)
    }

    public async process() {
        if (this.request.outgoing) {
            await this.send()
        } else {
            await this.receive()
        }
    }

    private async send() {
        // Waiting all channels are open
        await Promise.all(
            this.request.peerConnection
                .getDataChannels()
                .map(dataChannel => dataChannel.waitOpen())
        )

        this.changeState(TransferState.ACTIVE)

        let results = await Promise.all(
            this.request.peerConnection
                .getDataChannels()
                .map((dataChannel, index) => {
                    return dataChannel.send(this.request.files[index] as File)
                })
        )

        if (results.find(value => !value)) {
            this.changeState(TransferState.ERROR)
        } else {
            this.changeState(TransferState.DONE)
        }
    }

    private async receive() {
        this.request.peerConnection
            .on(PeerConnectionEvent.DATA_CHANNEL, async (dataChannel: DataChannel) => {
                let result = await dataChannel
                    .receive(data => {
                        console.log("RECEIVED", data.byteLength)
                    })

                if (result) {
                    this.receivedFiles += 1
                } else {
                    this.changeState(TransferState.ERROR)
                    return
                }

                if (this.receivedFiles == this.request.files.length) {
                    // ALl files received
                    this.changeState(TransferState.DONE)
                }
            })
    }

    private changeState(state: TransferState) {
        this.state = state

        if (this.state == TransferState.ERROR || this.state == TransferState.DONE) {
            this.request.peerConnection.close()
        }

        this.emit(TransferEvent.UPDATE)
    }

    private async handleCandidate(candidate: string): Promise<boolean> {
        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<RequestSignalRequest, RequestSignalResponse>({
                path: REQUEST_SIGNAL_PATH,
                request: {
                    requestId: this.request.id,
                    content: candidate
                }
            })

        return response.success
    }

    private setHandlers() {
        this.request.peerConnection
            .on(PeerConnectionEvent.CANDIDATE, this.handleCandidate.bind(this))

        // Sending cached candidates
        this.request.peerConnection
            .getCandidates()
            .forEach(this.handleCandidate.bind(this))
    }
}

