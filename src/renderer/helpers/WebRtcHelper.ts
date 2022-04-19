import * as constants from "renderer/constants"

export class PeerConnection {
    private offer: RTCSessionDescriptionInit = null
    private answer: RTCSessionDescriptionInit = null

    private peerConnection = new RTCPeerConnection(
        constants.WEBRTC_PEER_CONNECTION_CONFIG
    )

    public async getOffer(): Promise<string> {
        if (this.offer == null) {
            await this.createOffer()
        }

        return JSON.stringify(this.offer)
    }

    public async getAnswer(): Promise<string> {
        if (this.answer == null) {
            await this.createAnswer()
        }

        return JSON.stringify(this.answer)
    }

    public async setOffer(offer: string): Promise<boolean> {
        try {
            await this.peerConnection.setRemoteDescription(JSON.parse(offer))
            return true
        } catch (e) {
            return false
        }
    }

    public async setAnswer(answer: string) {
        try {
            await this.peerConnection.setRemoteDescription(JSON.parse(answer))
            return true
        } catch (e) {
            return false
        }
    }

    private async createOffer() {
        let offer = await this.peerConnection.createOffer()
        await this.peerConnection.setLocalDescription(offer)

        this.offer = offer
    }

    private async createAnswer() {
        let answer = await this.peerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(answer)

        this.answer = answer
    }
}
