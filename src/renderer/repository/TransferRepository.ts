import WebsocketHelper, {DroplyResponse, DroplyUpdate} from "renderer/helpers/WebsocketHelper";
import {FullUser, isFullUser, User, UserRepository} from "renderer/repository/UserRepository";
import {PeerConnection} from "renderer/helpers/WebRtcHelper";
import {EventEmitter} from "events";
import {AuthRepository} from "renderer/repository/AuthRepository";

/**
 * "request/send" method
 */

const REQUEST_SEND_PATH = "request/send"

interface RequestSendRequest {
    receiverId?: number
    receiverUrid?: number

    files: RequestFile[]

    // WebRTC data
    offer: string
}

interface RequestSendResponse extends DroplyResponse {
    request: {
        requestId: number
    }
}

/**
 * "request/answer" method
 */

const REQUEST_ANSWER_PATH = "request/answer"

interface RequestAnswerRequest {
    requestId: number
    accept: boolean

    // WebRTC data
    answer?: string
}

interface RequestAnswerResponse extends DroplyResponse {
    resolution: boolean
}

/**
 * "request/cancel" method
 */

const REQUEST_CANCEL_PATH = "request/cancel"

interface RequestCancelRequest {
    requestId: number
}

interface RequestCancelResponse extends DroplyResponse {
}

/**
 * "REQUEST_RECEIVED" update
 */

const REQUEST_RECEIVED_UPDATE_TYPE = "REQUEST_RECEIVED"

interface RequestReceivedContent {
    requestId: number,

    sender: User,
    receiver: User

    files: RequestFile[]

    // WebRTC data
    offer: string
}

/**
 * "REQUEST_ANSWERED" update
 */

const REQUEST_ANSWERED_UPDATE_TYPE = "REQUEST_ANSWERED"

interface RequestAnsweredContent {
    requestId: number,
    accept: boolean,

    // WebRTC data
    answer?: string
}

interface RequestFile {
    name: string,
    size: number
}

export interface Transfer {
    outgoing: boolean
    state: TransferState

    requestId: number

    sender: User
    receiver: User

    files: RequestFile[] | File[]

    // WebRTC
    peerConnection: PeerConnection
}

export enum TransferState {
    REQUESTED,
    ANSWERED,
    ACTIVE
}

export enum TransferRepositoryEvent {
    UPDATE = "update"
}

export class TransferRepository extends EventEmitter {
    public static Instance = new TransferRepository();

    private transfers: { [requestId: string]: Transfer } = {}

    constructor() {
        super()
        this.setHandlers()
    }


    public async sendRequest(files: File[], user: User | FullUser): Promise<Transfer> {
        await AuthRepository.Instance.waitAuth()

        let peerConnection = new PeerConnection()
        let offer = await peerConnection.getOffer()

        let parsedFiles = files.map(file => (<RequestFile>{
            name: file.name,
            size: file.size
        }))

        let response: RequestSendResponse

        if (isFullUser(user)) {
            response = await WebsocketHelper.Instance
                .request<RequestSendRequest, RequestSendResponse>({
                    path: REQUEST_SEND_PATH,
                    request: {
                        receiverId: user.id,
                        files: parsedFiles,
                        offer
                    }
                })
        } else {
            response = await WebsocketHelper.Instance
                .request<RequestSendRequest, RequestSendResponse>({
                    path: REQUEST_SEND_PATH,
                    request: {
                        receiverUrid: user.urid,
                        files: parsedFiles,
                        offer
                    }
                })
        }

        if (response.success) {
            this.transfers[response.request.requestId] = {
                outgoing: true,
                state: TransferState.REQUESTED,

                requestId: response.request.requestId,

                sender: await UserRepository.Instance.getUser(),
                receiver: user,

                files,
                peerConnection
            }

            // Sending update only in response successful
            this.emit(TransferRepositoryEvent.UPDATE)

            return this.transfers[response.request.requestId]
        }

        return null
    }

    public async answerRequest(requestId: number, accept: boolean): Promise<boolean> {
        await AuthRepository.Instance.waitAuth()

        let transfer = this.transfers[requestId]
        if (transfer == null || transfer.outgoing || transfer.state != TransferState.REQUESTED) {
            return false;
        }

        let request: RequestAnswerRequest = {
            requestId: transfer.requestId,
            accept,
        }

        if (accept) {
            request.answer = await transfer.peerConnection.getAnswer()
        }

        let response = await WebsocketHelper.Instance
            .request<RequestAnswerRequest, RequestAnswerResponse>({
                path: REQUEST_ANSWER_PATH,
                request
            })

        if (response.success && response.resolution) {
            transfer.state = TransferState.ANSWERED
        } else {
            // Request no longer valid
            delete this.transfers[transfer.requestId]
        }

        this.emit(TransferRepositoryEvent.UPDATE)
        return response.success
    }

    public async cancelRequest(requestId: number): Promise<boolean> {
        await AuthRepository.Instance.waitAuth()

        let transfer = this.transfers[requestId]
        if (transfer == null || transfer.state != TransferState.REQUESTED) {
            return false;
        }

        let response = await WebsocketHelper.Instance
            .request<RequestCancelRequest, RequestCancelResponse>({
                path: REQUEST_CANCEL_PATH,
                request: {requestId}
            })

        if (response.success) {
            delete this.transfers[requestId]

            this.emit(TransferRepositoryEvent.UPDATE)
        }

        return response.success
    }

    public listTransfers(state: TransferState | TransferState[]): Transfer[] {
        return Object
            .values(this.transfers)
            .filter(transfer => (state instanceof Array) ? state.includes(transfer.state) : transfer.state == state)
    }

    private async handleRequest(update: DroplyUpdate<RequestReceivedContent>) {
        let peerConnection = new PeerConnection()
        await peerConnection.setOffer(update.content.offer)

        this.transfers[update.content.requestId] = {
            outgoing: false,
            state: TransferState.REQUESTED,

            requestId: update.content.requestId,

            sender: update.content.sender,
            receiver: update.content.receiver,

            files: update.content.files,
            peerConnection: peerConnection
        }

        this.emit(TransferRepositoryEvent.UPDATE)
    }

    private async handleAnswer(update: DroplyUpdate<RequestAnsweredContent>) {
        let transfer = this.transfers[update.content.requestId]
        if (transfer == null || transfer.state != TransferState.REQUESTED) {
            return;
        }

        if (update.content.accept) {
            transfer.state = TransferState.ANSWERED
            await transfer.peerConnection.setAnswer(update.content.answer)
        } else {
            // Request no longer valid
            delete this.transfers[transfer.requestId]
        }

        this.emit(TransferRepositoryEvent.UPDATE)
    }

    private setHandlers() {
        WebsocketHelper.Instance.on(REQUEST_RECEIVED_UPDATE_TYPE, this.handleRequest)
        WebsocketHelper.Instance.on(REQUEST_ANSWERED_UPDATE_TYPE, this.handleAnswer)
    }
}
