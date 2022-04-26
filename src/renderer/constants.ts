export const WEBSOCKET_SERVER_ADDR = "wss://test.mine.theseems.ru"
export const WEBSOCKET_REQUEST_TIMEOUT = 5000

export const WEBRTC_PEER_CONNECTION_CONFIG: RTCConfiguration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
        {
            urls: "turn:51.250.69.216:3478",
            username: "username",
            credential: "password"
        }
    ],
    iceTransportPolicy: "relay"
}

export const WEBRTC_CHANNEL_CHUNK_SIZE = 1024 * 256

export const WEBRTC_TIMEOUT = 20000
