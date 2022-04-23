import * as constants from "renderer/constants"
import {EventEmitter} from "events";
import {FileDescription} from "renderer/repository/FileRepository";

export enum PeerConnectionEvent {
    CANDIDATE = "candidate"
}

export class PeerConnection extends EventEmitter {
    private peerConnection = new RTCPeerConnection(
        constants.WEBRTC_PEER_CONNECTION_CONFIG
    )

    private candidates: RTCIceCandidate[] = []

    private dataChannel = new DataChannel(this.peerConnection)

    constructor() {
        super();
        this.setHandlers()
    }

    public async createOffer(): Promise<string> {
        let offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(offer)

        return JSON.stringify(offer)
    }

    public async setOffer(offer: string) {
        await this.peerConnection.setRemoteDescription(JSON.parse(offer))
    }

    public async createAnswer(): Promise<string> {
        let answer = await this.peerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(answer)

        return JSON.stringify(answer)
    }

    public async setAnswer(answer: string) {
        await this.peerConnection.setRemoteDescription(JSON.parse(answer))
    }

    public getDataChannel(): DataChannel {
        return this.dataChannel
    }

    public getCandidates(): string[] {
        return this.candidates.map(candidate => JSON.stringify(candidate))
    }

    public async addCandidate(candidate: string) {
        await this.peerConnection.addIceCandidate(JSON.parse(candidate))
    }

    private handleIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate == null || event.candidate.candidate == null) {
            return
        }

        if (!this.emit(PeerConnectionEvent.CANDIDATE, JSON.stringify(event.candidate))) {
            this.candidates.push(event.candidate)
        }
    }

    private setHandlers() {
        this.peerConnection
            .addEventListener("icecandidate", this.handleIceCandidate.bind(this))

        this.peerConnection.addEventListener("icecandidateerror", e => console.log(e))
    }
}

const DATA_CHANNEL_ID = 1000
const DATA_CHANNEL_LABEL = "default"
const DATA_CHANNEL_EOF = "EOF"
const DATA_CHANNEL_LONG_LOW_BUFFER_TIMEOUT = 1000

interface Header {
    name: string,
    size: number
}

export class DataChannel extends EventEmitter {
    private peerConnection: RTCPeerConnection
    private dataChannel: RTCDataChannel

    private timeout;

    constructor(peerConnection: RTCPeerConnection) {
        super();
        this.peerConnection = peerConnection
        this.dataChannel = this.peerConnection
            .createDataChannel(DATA_CHANNEL_LABEL, {
                id: DATA_CHANNEL_ID,
                negotiated: true,
            })
    }

    public async send(files: File[]): Promise<boolean> {
        await this.waitOpen()
        this.setTimeout()

        for (let file of files) {
            let header = JSON.stringify({name: file.name, size: file.size})

            if (!await this.sendData(header)) {
                return false
            }

            console.log("[WEBRTC]: Sent header", header)

            for (let i = 0; i < file.size;) {
                let chunk = await file
                    .slice(i, i + constants.WEBRTC_CHANNEL_CHUNK_SIZE)
                    .arrayBuffer()

                if (!await this.sendData(chunk)) {
                    return false
                }

                console.log("[WEBRTC]: Sent data")
                i += chunk.byteLength
            }

            if (!await this.sendData(DATA_CHANNEL_EOF)) {
                return false
            }

            console.log("[WEBRTC]: Sent EOF")
        }

        return true
    }

    private async sendData(data): Promise<boolean> {
        this.dataChannel.send(data)

        await Promise.race([
            this.waitClose(),
            this.waitLowBuffer(),
        ])

        if (this.isOpened()) {
            this.resetTimeout()
        }

        return this.isOpened()
    }

    public async receive(files: FileDescription[]): Promise<boolean> {
        await this.waitOpen()
        this.setTimeout()

        return new Promise<boolean>(resolve => {
            let index = 0;

            let fd = 0;
            let receivedHeader: Header = null;
            let receivedSize = 0;

            this.dataChannel.addEventListener("close", () => {
                resolve(false)
            })

            this.dataChannel.addEventListener("message", async event => {
                this.resetTimeout()

                if (receivedHeader == null) {
                    // We need header
                    try {
                        receivedHeader = JSON.parse(event.data)
                    } catch (e) {
                        resolve(false)
                        return
                    }

                    console.log("[WEBRTC]: Received header", receivedHeader)

                    // Checking that we're receiving valid file
                    if (receivedHeader.name != files[index].name || receivedHeader.size != files[index].size) {
                        resolve(false)
                        return
                    }

                    // Opening file
                    fd = await DataChannel.openFile(receivedHeader.name)

                } else if (event.data == DATA_CHANNEL_EOF) {
                    console.log("[WEBRTC]: Received EOF")

                    // Checking that we received full file
                    if (receivedSize != files[index].size) {
                        await DataChannel.closeFile(fd)
                        resolve(false)

                        return
                    }

                    index += 1

                    // Clearing variables
                    receivedHeader = null
                    receivedSize = 0

                    if (index == files.length) {
                        await DataChannel.closeFile(fd)
                        resolve(true)

                        this.peerConnection.close()
                        return
                    }

                } else {
                    let data = event.data as ArrayBuffer
                    console.log("[WEBRTC]: Receiving data")

                    receivedSize += data.byteLength

                    if (receivedSize > files[index].size) {
                        await DataChannel.closeFile(fd)
                        resolve(false)

                        return
                    }

                    await DataChannel.writeFile(fd, new Uint8Array(data))
                }
            })
        })
    }

    private isOpened(): boolean {
        return this.dataChannel.readyState == "open"
    }

    private isClosed(): boolean {
        return this.dataChannel.readyState == "closed"
    }

    public async waitOpen() {
        if (this.isOpened()) {
            return
        }

        return new Promise<void>(resolve => {
            this.dataChannel.addEventListener("open", () => resolve(), {once: true})
        })
    }

    private async waitClose() {
        if (this.isClosed()) {
            return
        }

        return new Promise<void>(resolve => {
            this.dataChannel.addEventListener("close", () => resolve(), {once: true})
        })
    }

    private async waitLowBuffer() {
        if (this.dataChannel.bufferedAmount <= this.dataChannel.bufferedAmountLowThreshold) {
            console.log("[WEBRTC]: Low buffer")
            return
        }

        return new Promise<void>(resolve => {
            this.dataChannel.addEventListener("bufferedamountlow", () => resolve(), {once: true})
        })
    }

    private setTimeout() {
        this.timeout = setTimeout(this.handleTimeout.bind(this), constants.WEBRTC_TIMEOUT)
    }

    private resetTimeout() {
        clearTimeout(this.timeout)
        this.setTimeout()
    }

    private handleTimeout() {
        console.log("[WEBRTC]: Timeout")
        this.peerConnection.close()
    }

    private static async openFile(name: string): Promise<number> {
        return await window.externalApi.fileStorage.open(name)
    }

    private static async closeFile(fd: number) {
        return await window.externalApi.fileStorage.close(fd)
    }

    private static async writeFile(fd: number, data: ArrayBufferView) {
        return await window.externalApi.fileStorage.write(fd, data)
    }
}
