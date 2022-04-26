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

    public close() {
        this.peerConnection.close()
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

interface Header {
    name: string,
    size: number
}

export enum DataChannelEvent {
    STATISTICS = "statistics"
}

export interface Statistics {
    time: number
    speed: number

    size: number
    transferredSize: number

    files: StatisticsFile[]
}

export interface StatisticsFile {
    inner: FileDescription
    transferredSize: number
}

function emptyStatistics(files: FileDescription[]): Statistics {
    return {
        time: 0,
        speed: 0,

        size: files.reduce((size, file) => size + file.size, 0),
        transferredSize: 0,

        files: files.map(file => ({
            inner: file,
            transferredSize: 0,
        }))
    }
}

function copyStatistics(old: Statistics): Statistics {
    return {
        ...old,

        files: old.files.map(file => ({
            inner: file.inner,
            transferredSize: file.transferredSize,
        }))
    }
}

export class DataChannel extends EventEmitter {
    private dataChannel: RTCDataChannel
    private messages = []

    private timeout = null

    private statistics: Statistics = null
    private statisticsInterval = null

    private stableStatistics: Statistics = null

    constructor(
        private peerConnection: RTCPeerConnection
    ) {
        super();

        this.dataChannel = this.peerConnection
            .createDataChannel(DATA_CHANNEL_LABEL, {
                id: DATA_CHANNEL_ID,
                negotiated: true,
            })

        this.setHandlers()
    }

    public async send(files: File[]): Promise<boolean> {
        await this.waitOpen()

        this.logChosenCandidate()
        this.createTimeout()
        this.createStatistics(files)

        let result = true
        for (let i = 0; i < files.length; i++) {
            let file = files[i]

            if (!await this.sendHeader(file)) {
                result = false
                break
            }

            if (!await this.sendBody(file)) {
                result = false
                break
            }

            if (!await this.sendEOF()) {
                result = false
                break
            }
        }

        this.clearTimeout()
        this.clearStatistics()

        return result
    }

    private async sendHeader(file: File): Promise<boolean> {
        let header = JSON.stringify({name: file.name, size: file.size})

        if (!await this.sendMessage(header)) {
            return false
        }

        console.log("[WEBRTC]: Sent header", header)
        return true
    }

    private async sendBody(file: File): Promise<boolean> {
        for (let i = 0; i < file.size;) {
            let chunk = await file
                .slice(i, i + constants.WEBRTC_CHANNEL_CHUNK_SIZE)
                .arrayBuffer()

            if (!await this.sendMessage(chunk)) {
                return false
            }

            i += chunk.byteLength
            this.updateStatistics(file, chunk.byteLength)

            console.log("[WEBRTC]: Sent body chunk")
        }

        console.log("[WEBRTC]: Sent body")
        return true
    }

    private async sendEOF(): Promise<boolean> {
        if (!await this.sendMessage(DATA_CHANNEL_EOF)) {
            return false
        }

        console.log("[WEBRTC]: Sent EOF")
        return true
    }

    private async sendMessage(data): Promise<boolean> {
        this.dataChannel.send(data)

        await Promise.race([
            this.waitClose(),
            this.waitLowBuffer(),
        ])

        if (this.isOpened()) {
            this.createTimeout()
            return true
        }

        return false
    }

    public async receive(files: FileDescription[]): Promise<boolean> {
        await this.waitOpen()

        this.logChosenCandidate()
        this.createTimeout()
        this.createStatistics(files)

        let result = true
        for (let i = 0; i < files.length; i++) {
            let file = files[i]

            let fd = await this.receiveHeader(file)
            if (fd < 0) {
                result = false
                break
            }

            if (!await this.receiveBody(file, fd)) {
                result = false
                break
            }

            if (!await this.receiveEOF(fd)) {
                result = false
                break
            }
        }

        this.clearTimeout()
        this.clearStatistics()

        return result
    }

    private async receiveHeader(file: FileDescription): Promise<number> {
        let message = await this.receiveMessage() as string
        if (message == null) {
            return -1
        }

        let header: Header;
        try {
            header = JSON.parse(message)
        } catch (e) {
            return -1
        }

        // Checking that we're receiving valid file
        if (header.name != file.name || header.size != file.size) {
            return -1
        }

        console.log("[WEBRTC]: Received header", header)
        return await DataChannel.openFile(header.name)
    }

    private async receiveBody(file: FileDescription, fd: number): Promise<boolean> {
        let index = 0;

        while (index < file.size) {
            let message = await this.receiveMessage() as ArrayBuffer
            if (message == null) {
                break
            }

            index += message.byteLength
            this.updateStatistics(file, message.byteLength)

            await DataChannel.writeFile(fd, new Uint8Array(message))

            console.log("[WEBRTC]: Receiving body chunk")
        }

        if (index != file.size) {
            await DataChannel.closeFile(fd)
            return false
        }

        console.log("[WEBRTC]: Received body")
        return true
    }

    private async receiveEOF(fd: number): Promise<boolean> {
        await DataChannel.closeFile(fd)

        let message = await this.receiveMessage() as string
        if (message == null) {
            return false
        }

        if (message != DATA_CHANNEL_EOF) {
            return false
        }

        console.log("[WEBRTC]: Received EOF")
        return true
    }

    private async receiveMessage(): Promise<any> {
        let result = await Promise.race([
            this.waitClose(),
            this.waitMessage(),
        ])

        if (this.isOpened()) {
            this.createTimeout()
            return result
        }

        return null
    }

    public getStatistics() {
        return this.stableStatistics
    }

    private createStatistics(files: FileDescription[]) {
        this.statistics = emptyStatistics(files)
        this.statisticsInterval = setInterval(this.handleStatisticsInterval.bind(this), 1000)

        this.updateStableStatistics()
    }

    private updateStatistics(file: FileDescription, transferred: number) {
        this.statistics.speed += transferred
        this.statistics.transferredSize += transferred

        // Finding file by instance
        let foundFile = this.statistics.files.find(f => f.inner == file)

        foundFile.transferredSize += transferred
    }

    private updateStableStatistics() {
        this.stableStatistics = copyStatistics(this.statistics)
        this.emit(DataChannelEvent.STATISTICS)
    }

    private clearStatistics() {
        clearInterval(this.statisticsInterval)

        this.statistics = null
        this.statisticsInterval = null

        this.stableStatistics = null
    }

    private handleStatisticsInterval() {
        this.statistics.time =
            (this.statistics.size - this.statistics.transferredSize)
            / Math.max(this.statistics.speed, 1) // Speed can be 0

        // Updating stable statistics before zeroing speed
        this.updateStableStatistics()

        this.statistics.speed = 0
    }

    private createTimeout() {
        if (this.timeout != null) {
            clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(this.handleTimeout.bind(this), constants.WEBRTC_TIMEOUT)
    }

    private clearTimeout() {
        clearTimeout(this.timeout)
        this.timeout = null
    }

    private handleTimeout() {
        console.log("[WEBRTC]: Timeout")
        this.peerConnection.close()
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
            this.dataChannel
                .addEventListener("close", () => resolve(), {once: true})
        })
    }

    private async waitLowBuffer() {
        if (this.dataChannel.bufferedAmount <= this.dataChannel.bufferedAmountLowThreshold) {
            console.log("[WEBRTC]: Low buffer")
            return
        }

        return new Promise<void>(resolve => {
            this.dataChannel
                .addEventListener("bufferedamountlow", () => resolve(), {once: true})
        })
    }

    private async waitMessage() {
        if (this.messages.length > 0) {
            return this.messages.shift()
        }

        return new Promise<any>(resolve => {
            this.dataChannel
                .addEventListener("message", () => resolve(this.messages.shift()), {once: true})
        })
    }

    private setHandlers() {
        this.dataChannel.addEventListener("message", event => {
            this.messages.push(event.data)
        })
    }

    private logChosenCandidate() {
        this.peerConnection.getStats(null).then(report => {
            report.forEach(stat => {
                let remoteId;
                let localId;

                if (stat.type == "candidate-pair" && stat.nominated) {
                    remoteId = stat.remoteCandidateId
                    localId = stat.localCandidateId
                }

                this.peerConnection.getStats(null).then(report => {
                    report.forEach(stat => {
                        if (stat.id == remoteId) {
                            console.log("[WEBRTC]: Remote candidate", stat)
                            return
                        }

                        if (stat.id == localId) {
                            console.log("[WEBRTC]: Local candidate", stat)
                            return
                        }
                    })
                })

            })
        })
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

