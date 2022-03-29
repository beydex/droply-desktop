import {EventEmitter} from "events";

const URL = "wss://test.mine.theseems.ru"

export interface DroplyRequest<T> {
    path: string,
    request: T
}

export interface DroplyResponse {
    success: boolean
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
    public static Instance = new WebsocketHelper(URL);
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
        let response: DroplyResponse
        try {
            response = JSON.parse(message.data)
        } catch (e) {
            return;
        }

        if (this.queue.length == 0) {
            return;
        }

        this.queue[0].callback(response)
        this.queue.shift()
    }
}
