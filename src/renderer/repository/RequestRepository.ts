import WebsocketHelper, {DroplyResponse, DroplyUpdate} from "renderer/helpers/WebsocketHelper";
import {FullUser, isFullUser, User, UserRepository} from "renderer/repository/UserRepository";
import {PeerConnection} from "renderer/helpers/WebrtcHelper";
import {EventEmitter} from "events";
import {AuthRepository} from "renderer/repository/AuthRepository";
import {FileDescription} from "renderer/repository/FileRepository";
import {TransferRepository} from "renderer/repository/TransferRepository";

/**
 * "request/send" method
 */

const REQUEST_SEND_PATH = "request/send"

interface RequestSendRequest {
    receiverId?: number
    receiverUrid?: number

    files: FileDescription[]

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

    files: FileDescription[]

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

export interface Request {
    id: number
    outgoing: boolean

    sender: User
    receiver: User

    files: File[] | FileDescription[]

    // WebRTC
    peerConnection: PeerConnection
}

export enum RequestRepositoryEvent {
    UPDATE = "update"
}

export class RequestRepository extends EventEmitter {
    public static Instance = new RequestRepository();

    private requests: { [id: string]: Request } = {}

    constructor() {
        super()
        this.setHandlers()
    }

    public async sendRequest(user: FullUser | User, files: File[]): Promise<boolean> {
        let peerConnection = new PeerConnection()

        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<RequestSendRequest, RequestSendResponse>({
                path: REQUEST_SEND_PATH,
                request: {
                    ...(
                        isFullUser(user)
                            ? {receiverId: user.id}
                            : {receiverUrid: user.urid}
                    ),

                    files: files.map(file => {
                        peerConnection.createDataChannel(file.name)

                        return {
                            name: file.name,
                            size: file.size
                        }
                    }),

                    offer: await peerConnection.createOffer()
                }
            })

        if (response.success) {
            this.addRequest({
                id: response.request.requestId,
                outgoing: true,

                sender: await UserRepository.Instance.getUser(),
                receiver: user,

                files,
                peerConnection
            })
        }

        return response.success
    }

    public async answerRequest(id: number, accept: boolean): Promise<boolean> {
        let request = this.getRequest(id, false)
        if (request == null) {
            return false
        }

        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<RequestAnswerRequest, RequestAnswerResponse>({
                path: REQUEST_ANSWER_PATH,
                request: {
                    requestId: request.id,
                    accept,

                    ...(
                        accept && {answer: await request.peerConnection.createAnswer()}
                    )
                }
            })

        if (response.success && accept) {
            // Creating transfer once request was accepted
            await TransferRepository.Instance.createTransfer(request)
        }

        this.deleteRequest(id)
        return response.success
    }

    public async cancelRequest(id: number): Promise<boolean> {
        let request = this.getRequest(id, true)
        if (request == null) {
            return false
        }

        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<RequestCancelRequest, RequestCancelResponse>({
                path: REQUEST_CANCEL_PATH,
                request: {
                    requestId: id
                }
            })

        if (response.success) {
            this.deleteRequest(id)
        }

        return response.success
    }

    public list(): Request[] {
        return Object.values(this.requests)
    }

    private async handleRequest(update: DroplyUpdate<RequestReceivedContent>) {
        let peerConnection = new PeerConnection()
        await peerConnection.setOffer(update.content.offer)

        this.addRequest({
            id: update.content.requestId,
            outgoing: false,

            sender: update.content.sender,
            receiver: update.content.receiver,

            files: update.content.files,
            peerConnection
        })
    }

    private async handleAnswer(update: DroplyUpdate<RequestAnsweredContent>) {
        let request = this.requests[update.content.requestId]
        if (request == null) {
            return;
        }

        if (update.content.accept) {
            await request.peerConnection.setAnswer(update.content.answer)

            // Creating transfer once request was successfully accepted
            await TransferRepository.Instance.createTransfer(request)
        }

        this.deleteRequest(request.id)
    }

    private addRequest(request: Request) {
        this.requests[request.id] = request

        // Request map updated
        this.emit(RequestRepositoryEvent.UPDATE)
    }

    private getRequest(id: number, outgoing: boolean): Request {
        let request = this.requests[id]

        return request != null && request.outgoing == outgoing ? request : null
    }

    private deleteRequest(id: number) {
        delete this.requests[id]

        // Request map updated
        this.emit(RequestRepositoryEvent.UPDATE)
    }

    private setHandlers() {
        WebsocketHelper.Instance.on(
            REQUEST_RECEIVED_UPDATE_TYPE,
            this.handleRequest.bind(this)
        )

        WebsocketHelper.Instance.on(
            REQUEST_ANSWERED_UPDATE_TYPE,
            this.handleAnswer.bind(this)
        )
    }
}
