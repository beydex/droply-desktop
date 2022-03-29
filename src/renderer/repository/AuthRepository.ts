import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";
import {EventEmitter} from "events";


/**
 * "auth/google" request
 */
const AUTH_PATH = "auth"

interface AuthRequest {
    token: string
}

interface AuthResponse extends DroplyResponse {
}

/**
 * "auth/google" request
 */
const AUTH_GOOGLE_PATH = "auth/google"

interface AuthGoogleRequest {
    token: string
}

interface AuthGoogleResponse extends DroplyResponse {
    token: string
}

/**
 * "logout" request
 */
const LOGOUT_PATH = "logout"

interface LogoutRequest {
}

interface LogoutResponse extends DroplyResponse {
}

enum AuthRepositoryEvent {
    AUTH = "auth"
}

export class AuthRepository extends EventEmitter {
    public static Instance = new AuthRepository()

    private authenticated = false
    private token?: string

    public async waitAuth(): Promise<void> {
        if (this.authenticated) {
            return;
        }

        return new Promise(resolve => {
            this.once(AuthRepositoryEvent.AUTH, () => {
                resolve()
            })
        })
    }

    public async authByToken(): Promise<boolean> {
        if (this.authenticated) {
            return true
        }

        let token = await AuthRepository.readToken()
        if (token == "") {
            return false
        }

        let response = await WebsocketHelper.Instance
            .request<AuthRequest, AuthResponse>({
                path: AUTH_PATH,
                request: {token}
            })

        if (response.success) {
            await this.authFinish(token)
        }

        return response.success
    }

    public async authByGoogle(googleToken: string): Promise<boolean> {
        if (this.authenticated) {
            return true
        }

        let response = await WebsocketHelper.Instance
            .request<AuthGoogleRequest, AuthGoogleResponse>({
                path: AUTH_GOOGLE_PATH,
                request: {token: googleToken}
            })

        if (response.success) {
            await this.authFinish(response.token)
        }

        return response.success
    }

    private async authFinish(token: string) {
        await AuthRepository.writeToken(token)

        this.authenticated = true
        this.token = token

        this.emit(AuthRepositoryEvent.AUTH)
    }

    public async logout(): Promise<boolean> {
        if (!this.authenticated) {
            return true
        }

        let response = await WebsocketHelper.Instance
            .request<LogoutRequest, LogoutResponse>({
                path: LOGOUT_PATH,
                request: {}
            })

        if (response.success) {
            await AuthRepository.writeToken("")

            this.authenticated = false
            this.token = ""
        }

        return response.success
    }

    private static async readToken(): Promise<string> {
        return await window.externalApi.tokenStorage.readToken()
    }

    private static async writeToken(token: string): Promise<void> {
        await window.externalApi.tokenStorage.writeToken(token)
    }
}
