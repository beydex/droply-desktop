import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";

const AUTH_PATH = "auth"
const AUTH_GOOGLE_PATH = "auth/google"

interface AuthRequest {
    token: string
}

interface AuthResponse extends DroplyResponse {
}

interface AuthGoogleRequest {
    token: string
}

interface AuthGoogleResponse extends DroplyResponse {
    token: string
}

export class AuthRepository {
    public static Instance = new AuthRepository()
    private token?: string

    public async authByToken(): Promise<boolean> {
        let token = await this.readToken()
        if (token == "") {
            return false
        }

        let response = await WebsocketHelper.Instance
            .request<AuthRequest, AuthResponse>({
                path: AUTH_PATH,
                request: {token}
            })

        console.log("RESPONSE", response)

        if (!response.success) {
            // We have bad token, so clear it
            await this.writeToken("")
        }

        return response.success
    }

    public async authByGoogle(token: string): Promise<boolean> {
        let response = await WebsocketHelper.Instance
            .request<AuthGoogleRequest, AuthGoogleResponse>({
                path: AUTH_GOOGLE_PATH,
                request: {token: token}
            })

        console.log("GOT RESPONSE", response)

        if (response.success) {
            await this.writeToken(response.token)
        }

        return response.success
    }

    private async readToken(): Promise<string> {
        if (this.token == null) {
            this.token = await window.externalApi.tokenStorage.readToken()
        }

        return this.token
    }

    private async writeToken(token: string): Promise<void> {
        await window.externalApi.tokenStorage.writeToken(token)
        this.token = token
    }
}
