export const SERVER_ADDR = "wss://test.mine.theseems.ru"

export const WEBRTC_PEER_CONNECTION_CONFIG = {
    iceServers: [
        {
            urls: "turn:bularond.ru:3478",
            username: "bularond",
            credential: "6wktgE3Ky2sgWyja"
        },
        {
            urls: "stun:bularond.ru:3478",
            username: "bularond",
            credential: "6wktgE3Ky2sgWyja"
        },
    ]
}
