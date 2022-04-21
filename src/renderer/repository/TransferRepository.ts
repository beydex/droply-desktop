import {Request, RequestRepositoryEvent} from "renderer/repository/RequestRepository";
import {EventEmitter} from "events";
import {PeerConnectionEvent} from "renderer/helpers/WebrtcHelper";
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
        WebsocketHelper.Instance.on(
            REQUEST_SIGNAL_UPDATE_TYPE,
            this.handleSignaling.bind(this)
        )
    }
}

const CHUNK_SIZE = 1000

export enum TransferEvent {
    UPDATE = "update"
}

export enum TransferState {
    EXCHANGING,
    ACTIVE,
    DONE
}

export class Transfer extends EventEmitter {
    public request: Request

    // Transfer state
    public state = TransferState.EXCHANGING

    // Files that finished transferring
    private finishCount = 0

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
        // All data channels created during sending

        this.request.peerConnection
            .getDataChannels()
            .forEach((dataChannel, index) => {
                dataChannel.addEventListener("open", () => {
                    this.sendFile(this.request.files[index] as File, dataChannel)
                })
            })
    }

    private async sendFile(file: File, dataChannel: RTCDataChannel) {
        this.changeState(TransferState.ACTIVE)

        for (let i = 0; i < file.size;) {
            let chunk = await file.slice(i, i + CHUNK_SIZE).arrayBuffer()
            dataChannel.send(chunk)

            i += chunk.byteLength
        }

        dataChannel.close()
        this.finishFileTransfer()
    }

    private async receive() {
        // Not all channels could be created on that stage

        this.request.peerConnection.on(
            PeerConnectionEvent.DATA_CHANNEL,
            this.receiveFile.bind(this)
        )

        this.request.peerConnection
            .getDataChannels()
            .forEach(this.receiveFile)
    }

    private async receiveFile(dataChannel: RTCDataChannel) {
        dataChannel.addEventListener("message", message => {
            console.error("Message received:", message.data.toString())
        })

        dataChannel.addEventListener("close", () => {
            this.finishFileTransfer()
        })
    }

    private finishFileTransfer() {
        this.finishCount += 1

        if (this.finishCount == this.request.files.length) {
            this.changeState(TransferState.DONE)
        }
    }

    private changeState(state: TransferState) {
        if (this.state != state) {
            this.state = state
            this.emit(TransferEvent.UPDATE)
        }
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
        this.request.peerConnection.on(
            PeerConnectionEvent.CANDIDATE,
            this.handleCandidate.bind(this)
        )

        this.request.peerConnection
            .getCandidates()
            .forEach(this.handleCandidate.bind(this))
    }
}

