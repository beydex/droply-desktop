export const SERVER_ADDR = "wss://test.mine.theseems.ru"

export const WEBRTC_PEER_CONNECTION_CONFIG = {
    iceServers: [
        {
            urls: "turn:mine.theseems.ru:3478",
            username: "username",
            credential: "password"
        },
    ]
}
