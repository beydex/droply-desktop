import * as constants from "renderer/constants"
import {EventEmitter} from "events";


export enum PeerConnectionEvent {
    CANDIDATE = "candidate",
    DATA_CHANNEL = "data-channel"
}

export class PeerConnection extends EventEmitter {
    private peerConnection = new RTCPeerConnection(
        constants.WEBRTC_PEER_CONNECTION_CONFIG
    )

    private candidates: RTCIceCandidate[] = []
    private dataChannels: DataChannel[] = []

    constructor() {
        super()
        this.setHandlers()
    }

    public async createOffer(): Promise<string> {
        let offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(offer)

        return JSON.stringify(offer)
    }

    public async setOffer(offer: string) {
        try {
            await this.peerConnection.setRemoteDescription(JSON.parse(offer))
        } catch (e) {
            // TODO: Handle this
        }
    }

    public async createAnswer(): Promise<string> {
        let answer = await this.peerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(answer)

        return JSON.stringify(answer)
    }

    public async setAnswer(answer: string) {
        try {
            await this.peerConnection.setRemoteDescription(JSON.parse(answer))
        } catch (e) {
            // TODO: Handle this
        }
    }

    public getCandidates(): string[] {
        return this.candidates.map(candidate => JSON.stringify(candidate))
    }

    public async addCandidate(candidate: string) {
        try {
            await this.peerConnection.addIceCandidate(JSON.parse(candidate))
        } catch (e) {
            // TODO: Handle this
        }
    }

    public createDataChannel(label: string) {
        this.dataChannels.push(
            new DataChannel(this.peerConnection, this.peerConnection.createDataChannel(label))
        )
    }

    public getDataChannels(): DataChannel[] {
        console.log(this.peerConnection.getReceivers(), this.peerConnection.getSenders())
        return this.dataChannels
    }

    public close() {
        this.peerConnection.close()
    }

    private async handleIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate == null || event.candidate.candidate == null) {
            return
        }

        if (!this.emit(PeerConnectionEvent.CANDIDATE, JSON.stringify(event.candidate))) {
            console.log("candidates")
            this.candidates.push(event.candidate)
        }
    }

    private async handleDataChannel(event: RTCDataChannelEvent) {
        this.emit(PeerConnectionEvent.DATA_CHANNEL, new DataChannel(this.peerConnection, event.channel))
    }

    private setHandlers() {
        this.peerConnection
            .addEventListener("icecandidate", this.handleIceCandidate.bind(this))

        this.peerConnection
            .addEventListener("datachannel", this.handleDataChannel.bind(this))
    }
}

export class DataChannel {
    public static readonly EOF = "EOF"
    public static readonly ChunkSize = 1024 * 64

    private peerConnection: RTCPeerConnection
    private dataChannel: RTCDataChannel

    constructor(peerConnection: RTCPeerConnection, dataChannel: RTCDataChannel) {
        this.peerConnection = peerConnection

        this.dataChannel = dataChannel
        this.dataChannel.binaryType = "arraybuffer"

        this.dataChannel.addEventListener("error", console.error)
    }

    public label(): string {
        return this.dataChannel.label
    }

    public async waitOpen() {
        await this.waitEvent("open")
    }

    public async send(file: File): Promise<boolean> {
        for (let i = 0; i < file.size;) {
            let chunk = await file
                .slice(i, i + DataChannel.ChunkSize)
                .arrayBuffer()

            this.dataChannel.send(chunk)
            i += chunk.byteLength

            await Promise.race([
                this.waitEvent("bufferedamountlow"),
                this.waitEvent("close")
            ])

            console.log("SENDING", file.name, (i / file.size * 100).toFixed(2))

            if (this.isClosed()) {
                console.log("CLOSED", file.name)
                return false
            }
        }

        console.log("SENT", file.name)

        this.dataChannel.send(DataChannel.EOF)
        this.dataChannel.close()

        return true
    }

    public async receive(cb: (data: ArrayBuffer) => void): Promise<boolean> {
        while (true) {
            let result = await Promise.race([
                this.waitEvent("message"),
                this.waitEvent("close")
            ])

            if (this.isClosed()) {
                return false
            }

            let data = (result as MessageEvent).data
            if (data == DataChannel.EOF) {
                return true
            }

            cb((result as MessageEvent).data)
        }
    }

    public isClosed(): boolean {
        return this.dataChannel.readyState == "closed"
    }

    private async waitEvent<T extends keyof RTCDataChannelEventMap>(event: T): Promise<RTCDataChannelEventMap[T]> {
        return new Promise<RTCDataChannelEventMap[T]>((resolve => {
            this.dataChannel.addEventListener(event, resolve, {once: true})
        }))
    }
}
