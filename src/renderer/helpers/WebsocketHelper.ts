import {EventEmitter} from "events";

import * as constants from "renderer/constants"

export interface DroplyRequest<T> {
    path: string,
    request: T
}

export interface DroplyResponse {
    success: boolean
}

export interface DroplyUpdate<T> {
    content: T
    type: string
}

export interface DroplyMessage {
    success?: boolean
    update?: DroplyUpdate<any>
}

interface Request {
    state: RequestState,
    timeout: ReturnType<typeof setTimeout>,

    request: DroplyRequest<any>,
    callback: (response: any) => void
}

enum RequestState {
    PENDING,
    SENDING
}

export enum WebsocketHelperEvent {
    OPEN = "open",
    CLOSE = "close",
    REQUEST = "request"
}

export default class WebsocketHelper extends EventEmitter {
    public static Instance = new WebsocketHelper();

    private websocket: WebSocket
    private requests: Request[] = []

    private constructor() {
        super()
        this.websocket = this.createWebsocket()

        // Starting to send requests from queue
        this.sendRequests().then()
    }

    public async waitOpen(): Promise<void> {
        return new Promise<void>(resolve => {
            if (this.websocket.readyState == WebSocket.OPEN) {
                resolve()
                return
            }

            this.once(WebsocketHelperEvent.OPEN, resolve)
        })
    }

    public async request<T, U extends DroplyResponse>(request: DroplyRequest<T>): Promise<U> {
        return new Promise<U>(resolve => {
            this.requests.push({
                state: RequestState.PENDING,
                timeout: setTimeout(this.handleTimeout.bind(this), constants.WEBSOCKET_REQUEST_TIMEOUT),

                request: request,
                callback: resolve
            })

            console.log("[SOCKET]: Request", JSON.stringify(request, null, 2))

            this.emit(WebsocketHelperEvent.REQUEST)
        })
    }

    private async sendRequests() {
        // noinspection InfiniteLoopJS
        while (true) {
            try {
                let request = await this.getRequest()
                this.websocket.send(JSON.stringify(request))
            } catch (e) {
                // Ignore
            }
        }
    }

    private async getRequest(): Promise<DroplyRequest<any>> {
        return new Promise<DroplyRequest<any>>(async resolve => {
            await this.waitOpen()

            let item = this.getPendingRequest()
            if (item != null) {
                resolve(item.request)
                return
            }

            // No item found
            this.once(WebsocketHelperEvent.REQUEST, () => {
                resolve(this.getPendingRequest().request)
            })
        })
    }

    private getPendingRequest(): Request {
        for (let item of this.requests) {
            if (item.state == RequestState.PENDING) {
                item.state = RequestState.SENDING
                return item
            }
        }

        return null
    }

    private createWebsocket(): WebSocket {
        let websocket = new WebSocket(
            constants.WEBSOCKET_SERVER_ADDR
        )

        websocket.addEventListener("open", this.handleOpen.bind(this))
        websocket.addEventListener("close", this.handleClose.bind(this))
        websocket.addEventListener("message", this.handleMessage.bind(this))

        return websocket
    }

    private handleOpen() {
        console.log("[SOCKET]: Opened")

        // Updating request queue
        this.requests = []

        this.emit(WebsocketHelperEvent.OPEN)
    }

    private handleClose() {
        console.log("[SOCKET]: Closed")

        // Updating request queue
        this.requests.forEach(request => clearTimeout(request.timeout))

        // Recreating socket
        this.websocket = this.createWebsocket()

        this.emit(WebsocketHelperEvent.CLOSE)
    }

    private handleMessage(event: MessageEvent<string>) {
        let message: DroplyMessage
        try {
            message = JSON.parse(event.data)
        } catch (e) {
            return;
        }

        if (message.update) {
            this.handleUpdate(message.update)
            return;
        }

        if (this.requests.length != 0) {
            this.handleResponse(message)
        }
    }

    private handleUpdate(update: DroplyUpdate<any>) {
        console.log("[SOCKET]: Update", JSON.stringify(update, null, 2))

        this.emit(update.type, update.content)
    }

    private handleResponse(response) {
        console.log("[SOCKET]: Response", JSON.stringify(response, null, 2))

        let request = this.requests.shift()

        clearTimeout(request.timeout)
        request.callback(response)
    }

    private handleTimeout() {
        console.log("[SOCKET]: Timeout")

        // Closing connection on timeout
        this.websocket.close()
    }
}
