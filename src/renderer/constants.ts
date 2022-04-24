export const WEBSOCKET_SERVER_ADDR = "wss://test.mine.theseems.ru"
export const WEBSOCKET_REQUEST_TIMEOUT = 5000

export const WEBRTC_PEER_CONNECTION_CONFIG: RTCConfiguration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        }
    ],
}

export const WEBRTC_CHANNEL_CHUNK_SIZE = 1024 * 256

export const WEBRTC_TIMEOUT = 20000
