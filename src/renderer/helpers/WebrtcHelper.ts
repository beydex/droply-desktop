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
    private dataChannels: RTCDataChannel[] = []

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
        this.dataChannels.push(this.peerConnection.createDataChannel(label))
    }

    public getDataChannels(): RTCDataChannel[] {
        return this.dataChannels
    }

    private async handleIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate == null) {
            return
        }

        if (!this.emit(PeerConnectionEvent.CANDIDATE, JSON.stringify(event.candidate))) {
            this.candidates.push(event.candidate)
        }
    }

    private setHandlers() {
        this.peerConnection.addEventListener(
            "icecandidate",
            this.handleIceCandidate.bind(this)
        )

        this.peerConnection.addEventListener(
            "icecandidateerror",
            event => console.log("ICE ERROR", event)
        )
    }
}
