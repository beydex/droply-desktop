import WebsocketHelper, {DroplyResponse, WebsocketHelperEvent} from "renderer/helpers/WebsocketHelper";
import {EventEmitter} from "events";


/**
 * "auth" request
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
 * "auth/logout" request
 */
const AUTH_LOGOUT_PATH = "auth/logout"

interface AuthLogoutRequest {
}

interface AuthLogoutResponse extends DroplyResponse {
}

export enum AuthRepositoryEvent {
    AUTH = "auth",
    LOGOUT = "logout"
}

export class AuthRepository extends EventEmitter {
    public static Instance = new AuthRepository()

    private authenticated = false
    private token?: string

    constructor() {
        super();
        this.setHandlers()
    }

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
            await this.finishAuth(response.token)
        }

        return response.success
    }

    private async authByToken(): Promise<boolean> {
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
            await this.finishAuth(token)
        }

        return response.success
    }

    public async logout(): Promise<boolean> {
        if (!this.authenticated) {
            return true
        }

        let response = await WebsocketHelper.Instance
            .request<AuthLogoutRequest, AuthLogoutResponse>({
                path: AUTH_LOGOUT_PATH,
                request: {}
            })

        if (response.success) {
            await this.finishLogout()
        }

        return response.success
    }

    private async finishAuth(token: string) {
        await AuthRepository.writeToken(token)

        this.authenticated = true
        this.token = token

        this.emit(AuthRepositoryEvent.AUTH)
    }

    private async finishLogout() {
        await AuthRepository.writeToken("")

        this.authenticated = false
        this.token = ""

        this.emit(AuthRepositoryEvent.LOGOUT)
    }

    private setHandlers() {
        WebsocketHelper.Instance.on(WebsocketHelperEvent.OPEN, async () => {
            if (await this.authByToken()) {
                this.emit(AuthRepositoryEvent.AUTH)
            } else {
                this.emit(AuthRepositoryEvent.LOGOUT)
            }
        })

        WebsocketHelper.Instance.on(WebsocketHelperEvent.CLOSE, () => {
            this.authenticated = false
        })
    }

    private static async readToken(): Promise<string> {
        return await window.externalApi.tokenStorage.readToken()
    }

    private static async writeToken(token: string): Promise<void> {
        await window.externalApi.tokenStorage.writeToken(token)
    }
}
