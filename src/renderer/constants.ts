export const WEBSOCKET_SERVER_ADDR = "wss://test.mine.theseems.ru"
export const WEBSOCKET_REQUEST_TIMEOUT = 5000

export const WEBRTC_PEER_CONNECTION_CONFIG: RTCConfiguration = {
    iceServers: [
        {
            urls: "stun:mine.theseems.ru:3478",
            username: "username",
            credential: "password"
        },
        {
            urls: "turn:mine.theseems.ru:3478",
            username: "username",
            credential: "password"
        },
    ],
    iceTransportPolicy: "relay"
}

export const WEBRTC_CHANNEL_CHUNK_SIZE = 1024 * 64
