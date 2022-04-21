import electron from "electron";
import DeeplinkManager from "main/application/DeeplinkManager";
import WindowManager from "main/application/WindowManager";

const AUTH_URL = "https://auth.droply.ru/google"
const DEEPLINK_EVENT = "google"

enum IpcEvent {
    Token = "google-auth:token"
}

export interface GoogleAuthPreload {
    openBrowser: () => Promise<void>
    onToken: (callback: (token: string) => void) => void
}

export class GoogleAuth {
    private readonly windowManager: WindowManager
    private readonly deeplinkManager: DeeplinkManager

    constructor(windowManager: WindowManager, deeplinkManager: DeeplinkManager) {
        this.windowManager = windowManager
        this.deeplinkManager = deeplinkManager

        this.handleDeeplink()
    }

    public static getPreload(): GoogleAuthPreload {
        return {
            async openBrowser() {
                await electron.shell.openExternal(AUTH_URL)
            },

            onToken(callback: (token: string) => void) {
                electron.ipcRenderer.on(IpcEvent.Token, (event, token) => {
                    callback(token)
                })
            }
        }
    }

    public handleDeeplink() {
        this.deeplinkManager.on(DEEPLINK_EVENT, async token => {
            await this.windowManager.send(IpcEvent.Token, token)
        })
    }
}
