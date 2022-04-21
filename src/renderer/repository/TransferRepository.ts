import {Request} from "renderer/repository/RequestRepository";
import {EventEmitter} from "events";
import {User} from "renderer/repository/UserRepository";
import {PeerConnection, PeerConnectionEvent} from "renderer/helpers/WebrtcHelper";
import {FileDescription} from "renderer/repository/FileRepository";
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

    public createTransfer(request: Request) {
        this.addTransfer(new Transfer(request))
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
        this.transfers[transfer.id] = transfer

        // Request map updated
        this.emit(TransferRepositoryEvent.UPDATE)
    }

    private getTransfer(id: number): Transfer {
        let transfer = this.transfers[id]

        return transfer ? transfer : null
    }

    private setHandlers() {
        WebsocketHelper.Instance.on(
            REQUEST_SIGNAL_UPDATE_TYPE,
            this.handleSignaling.bind(this)
        )
    }
}

export class Transfer {
    public id: number
    public outgoing: boolean

    public sender: User
    public receiver: User

    public files: File[] | FileDescription[]

    // WebRTC
    private peerConnection: PeerConnection

    constructor(request: Request) {
        this.id = request.id
        this.outgoing = request.outgoing

        this.sender = request.sender
        this.receiver = request.receiver

        this.files = request.files
        this.peerConnection = request.peerConnection

        this.setHandlers()

        // Starting transfer
        if (this.outgoing) {
            this.startTransfer().then()
        }
    }

    public async addCandidate(candidate: string) {
        await this.peerConnection.addCandidate(candidate)
    }

    private async startTransfer() {
    }

    private async handleCandidate(candidate: string): Promise<boolean> {
        await AuthRepository.Instance.waitAuth()
        console.log("CANDIDATE SENDING")

        let response = await WebsocketHelper.Instance
            .request<RequestSignalRequest, RequestSignalResponse>({
                path: REQUEST_SIGNAL_PATH,
                request: {
                    requestId: this.id,
                    content: candidate
                }
            })

        return response.success
    }

    private setHandlers() {
        this.peerConnection.on(
            PeerConnectionEvent.CANDIDATE,
            this.handleCandidate.bind(this)
        )

        this.peerConnection
            .getCandidates()
            .forEach(this.handleCandidate.bind(this))
    }
}

