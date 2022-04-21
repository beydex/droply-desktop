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
    success?: string
    update?: DroplyUpdate<any>
}

interface QueueItem {
    state: QueueItemState,

    request: DroplyRequest<any>,
    callback: (response: any) => void
}

enum QueueItemState {
    PENDING,
    SENDING
}

export enum WebsocketHelperEvent {
    OPEN = "open",
    CLOSE = "close",
    REQUEST = "request"
}

export default class WebsocketHelper extends EventEmitter {
    public static Instance = new WebsocketHelper(constants.SERVER_ADDR);
    private readonly url: string
    private readonly queue: QueueItem[]
    private websocket: WebSocket

    private constructor(url: string) {
        super()
        this.url = url
        this.websocket = this.createWebsocket()

        this.queue = []

        // Starting to send requests from queue
        this.sendRequests().then()
    }

    public async waitOpen(): Promise<void> {
        return new Promise<void>(resolve => {
            if (this.websocket.readyState == WebSocket.OPEN) {
                resolve()
                return
            }

            this.once(WebsocketHelperEvent.OPEN, () => {
                console.log("SOCKET OPENED")
                // Setting to PENDING state
                for (let item of this.queue) {
                    item.state = QueueItemState.PENDING
                }

                resolve()
            })
        })
    }

    public async request<T, U extends DroplyResponse>(request: DroplyRequest<T>): Promise<U> {
        return new Promise<U>(resolve => {
            this.queue.push({
                state: QueueItemState.PENDING,
                request: request,

                callback: response => {
                    resolve(response);
                }
            });

            this.emit(WebsocketHelperEvent.REQUEST)
            console.log("request", JSON.stringify(request, null, 2))
        })
    }

    private createWebsocket(): WebSocket {
        let websocket = new WebSocket(this.url)

        websocket.onopen = () => {
            this.handleOpen()
        }

        websocket.onclose = () => {
            this.handleClose()
        }

        websocket.onmessage = message => {
            this.handleMessage(message)
        }

        return websocket
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

            let item = this.getQueueFirstPendingItem()
            if (item != null) {
                item.state = QueueItemState.SENDING

                resolve(item.request)
                return
            }

            // No item found
            this.once(WebsocketHelperEvent.REQUEST, () => {
                let item = this.getQueueFirstPendingItem()

                // Queue must have at least one element
                item.state = QueueItemState.SENDING

                resolve(item.request)
            })
        })
    }

    private getQueueFirstPendingItem(): QueueItem {
        for (let item of this.queue) {
            if (item.state == QueueItemState.PENDING) {
                return item
            }
        }

        return null
    }

    private handleOpen() {
        this.emit(WebsocketHelperEvent.OPEN)
    }

    private handleClose() {
        this.emit(WebsocketHelperEvent.CLOSE)
        this.websocket = this.createWebsocket()
    }

    private handleMessage(message: MessageEvent<string>) {
        let parsedMessage: DroplyMessage
        try {
            parsedMessage = JSON.parse(message.data)
        } catch (e) {
            return;
        }

        if (parsedMessage.update) {
            console.log("update", JSON.stringify(parsedMessage, null, 2))
            this.emit(parsedMessage.update.type, parsedMessage.update)
            return;
        }

        if (this.queue.length == 0) {
            return;
        }

        console.log("response", JSON.stringify(parsedMessage, null, 2))
        this.queue.shift().callback(parsedMessage)
    }
}
