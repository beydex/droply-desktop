import fs from "fs"
import path from "path"
import electron from "electron";

import Application from "main/application/Application";
import WindowManager from "main/application/WindowManager";

const TOKEN_FILE = "token.txt"

enum IpcEvent {
    Read = "token-storage:read",
    Write = "token-storage:write"
}

export interface TokenStoragePreload {
    readToken: () => Promise<string>;
    writeToken: (token) => Promise<void>;
}

export class TokenStorage {
    private readonly windowManager: WindowManager

    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager
        this.setHandlers()
    }

    public static getPreload(): TokenStoragePreload {
        return {
            async readToken(): Promise<string> {
                return await electron.ipcRenderer.invoke(IpcEvent.Read)
            },

            async writeToken(token: string): Promise<void> {
                return await electron.ipcRenderer.invoke(IpcEvent.Write, token)
            }
        }
    }

    private handleReadToken() {
        this.windowManager.handleInvoke(IpcEvent.Read, () => {
            return new Promise<string>((resolve, reject) => {
                let tokenFile = path.resolve(Application.Instance.getApp().getPath("userData"), TOKEN_FILE)

                let callback = (err, data) => {
                    if (err != null && err.code != "ENOENT") {
                        reject(err)
                        return
                    }

                    resolve(err == null ? data.toString() : "")
                }

                fs.readFile(tokenFile, callback)
            })
        })
    }

    private handleWriteToken() {
        this.windowManager.handleInvoke(IpcEvent.Write, (token: string) => {
            return new Promise<void>((resolve, reject) => {
                let tokenFile = path.resolve(Application.Instance.getApp().getPath("userData"), TOKEN_FILE)

                let callback = err => {
                    if (err != null) {
                        reject(err)
                        return
                    }

                    resolve()
                }

                fs.writeFile(tokenFile, token, callback)
            })
        })
    }

    private setHandlers() {
        this.handleReadToken()
        this.handleWriteToken()
    }
}
