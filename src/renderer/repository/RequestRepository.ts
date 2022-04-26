import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";
import {FullUser, isFullUser, User} from "renderer/repository/UserRepository";
import {DataChannelEvent, PeerConnection, PeerConnectionEvent} from "renderer/helpers/WebrtcHelper";
import {EventEmitter} from "events";
import {AuthRepository} from "renderer/repository/AuthRepository";
import {FileDescription, FileRepository} from "renderer/repository/FileRepository";
import {RemoveMethods} from "renderer/types";

import * as constants from "renderer/constants"

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
 * "REQUEST_RECEIVED" update
 */

const REQUEST_RECEIVED_UPDATE_TYPE = "REQUEST_RECEIVED"

interface RequestReceivedUpdate {
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

interface RequestAnsweredUpdate {
    requestId: number,
    accept: boolean,

    // WebRTC data
    answer?: string
}

/**
 * "REQUEST_SIGNAL" update
 */

const REQUEST_SIGNAL_UPDATE_TYPE = "REQUEST_SIGNAL"

interface RequestSignalUpdate {
    requestId: number,

    // WebRTC data
    content: string
}

export enum RequestRepositoryEvent {
    UPDATE = "update",
    CURRENT_REQUEST_UPDATE = "current-request-update"
}

export class RequestRepository extends EventEmitter {
    public static Instance = new RequestRepository();

    private requests: { [id: string]: Request } = {}
    private currentRequest: Request

    constructor() {
        super()
        this.setHandlers()
    }

    public setCurrentRequest(id: number) {
        let request = this.requests[id]
        if (request == null) {
            return
        }

        this.currentRequest = request
        this.emit(RequestRepositoryEvent.CURRENT_REQUEST_UPDATE)
    }

    public getCurrentRequest(): Request {
        return this.currentRequest
    }

    public async createRequest(user: FullUser | User): Promise<boolean> {
        let peerConnection = new PeerConnection()

        await AuthRepository.Instance.waitAuth()
        let files = FileRepository.Instance.getFiles()

        let response = await WebsocketHelper.Instance
            .request<RequestSendRequest, RequestSendResponse>({
                path: REQUEST_SEND_PATH,
                request: {
                    ...(
                        isFullUser(user)
                            ? {receiverId: user.id}
                            : {receiverUrid: user.urid}
                    ),

                    files: files.map(file => ({
                        name: file.name,
                        size: file.size
                    })),

                    offer: await peerConnection.createOffer()
                }
            })

        if (response.success) {
            this.addRequest(
                new Request({
                    id: response.request.requestId,
                    outgoing: true,
                    user,
                    files,
                    peerConnection
                })
            )
        }

        return response.success
    }

    public async answerRequest(id: number, accept: boolean) {
        let request = this.requests[id]
        if (request == null) {
            return
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
            // Starting transfer in background
            request.transfer().then()
        } else {
            this.deleteRequest(request.id)

            if (!response.success) {
                alert("Failed to answer request")
            }
        }
    }

    public async cancelRequest(id: number) {
        let request = this.requests[id]
        if (request == null) {
            return
        }

        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<RequestCancelRequest, RequestCancelResponse>({
                path: REQUEST_CANCEL_PATH,
                request: {requestId: request.id}
            })

        this.deleteRequest(request.id)

        if (!response.success) {
            alert("Failed to cancel request")
        }
    }

    public async sendRequestCandidate(id: number, candidate: string) {
        let request = this.requests[id]
        if (request == null) {
            return
        }

        await AuthRepository.Instance.waitAuth()

        await WebsocketHelper.Instance
            .request<RequestSignalRequest, RequestSignalResponse>({
                path: REQUEST_SIGNAL_PATH,
                request: {
                    requestId: request.id,
                    content: candidate
                }
            })
    }

    public listRequests(states: RequestState[]): Request[] {
        return Object.values(this.requests).filter(request => states.includes(request.state))
    }

    private async handleRequest(update: RequestReceivedUpdate) {
        let peerConnection = new PeerConnection()
        await peerConnection.setOffer(update.offer)

        this.addRequest(
            new Request({
                id: update.requestId,
                outgoing: false,
                user: update.sender,
                files: update.files,
                peerConnection
            })
        )
    }

    private async handleAnswer(update: RequestAnsweredUpdate) {
        let request = this.requests[update.requestId]
        if (request == null) {
            return;
        }

        if (update.accept) {
            await request.peerConnection.setAnswer(update.answer)

            // Starting transfer in background
            request.transfer().then()
        } else {
            this.deleteRequest(update.requestId)
        }
    }

    private async handleSignal(update: RequestSignalUpdate) {
        let request = this.requests[update.requestId]
        if (request == null) {
            return;
        }

        await request.peerConnection.addCandidate(update.content)
    }

    private addRequest(request: Request) {
        this.requests[request.id] = request

        this.setRequestHandlers(request)
        this.emit(RequestRepositoryEvent.UPDATE)
    }

    private deleteRequest(id: number) {
        let request = this.requests[id]
        if (request == null) {
            return
        }

        // Close everything
        request.peerConnection.close()

        delete this.requests[id]
        this.emit(RequestRepositoryEvent.UPDATE)
    }

    private setRequestHandlers(request: Request) {
        request.on(RequestEvent.UPDATE, () => {
            this.emit(RequestRepositoryEvent.UPDATE)

            if ([RequestState.DONE, RequestState.ERROR].includes(request.state)) {
                setTimeout(
                    this.deleteRequest.bind(this),
                    constants.WEBSOCKET_REQUEST_TIMEOUT,
                    request.id
                )
            }
        })
    }

    private setHandlers() {
        WebsocketHelper.Instance
            .on(REQUEST_RECEIVED_UPDATE_TYPE, this.handleRequest.bind(this))

        WebsocketHelper.Instance
            .on(REQUEST_ANSWERED_UPDATE_TYPE, this.handleAnswer.bind(this))

        WebsocketHelper.Instance
            .on(REQUEST_SIGNAL_UPDATE_TYPE, this.handleSignal.bind(this))

    }
}

export enum RequestState {
    CREATED,
    EXCHANGING,
    ACTIVE,
    DONE,
    ERROR
}

export enum RequestEvent {
    UPDATE = "update"
}

export class Request extends EventEmitter {
    public id: number
    public outgoing: boolean
    public user: User
    public files: File[] | FileDescription[]
    public peerConnection: PeerConnection

    public state = RequestState.CREATED

    constructor(params: Omit<RemoveMethods<Request>, "state">) {
        super()
        Object.assign(this, params)

        this.setHandlers()
    }

    public async answer(accept: boolean) {
        await RequestRepository.Instance.answerRequest(this.id, accept)
    }

    public async cancel() {
        await RequestRepository.Instance.cancelRequest(this.id)
    }

    public async transfer() {
        if (this.outgoing) {
            await this.send()
        } else {
            await this.receive()
        }
    }

    public async send() {
        this.setState(RequestState.EXCHANGING)
        this.sendCandidates()

        await this.peerConnection.getDataChannel().waitOpen()
        this.setState(RequestState.ACTIVE)

        if (await this.peerConnection.getDataChannel().send(this.files as File[])) {
            this.setState(RequestState.DONE)
        } else {
            this.setState(RequestState.ERROR)
        }
    }

    public async receive() {
        this.setState(RequestState.EXCHANGING)
        this.sendCandidates()

        await this.peerConnection.getDataChannel().waitOpen()
        this.setState(RequestState.ACTIVE)

        let result = await this.peerConnection.getDataChannel()
            .receive(this.files as FileDescription[])

        if (result) {
            this.setState(RequestState.DONE)
        } else {
            this.setState(RequestState.ERROR)
        }
    }

    public getStatistics() {
        return this.peerConnection.getDataChannel().getStatistics()
    }

    private sendCandidates() {
        this.peerConnection
            .on(PeerConnectionEvent.CANDIDATE, async candidate => {
                await RequestRepository.Instance.sendRequestCandidate(this.id, candidate)
            })

        this.peerConnection.getCandidates()
            .map(async candidate => {
                await RequestRepository.Instance.sendRequestCandidate(this.id, candidate)
            })
    }

    private setState(state: RequestState) {
        if (this.state != state) {
            this.state = state
            this.emit(RequestEvent.UPDATE)
        }
    }

    private setHandlers() {
        this.peerConnection.getDataChannel()
            .on(DataChannelEvent.STATISTICS, () => {
                this.emit(RequestEvent.UPDATE)
            })
    }
}
