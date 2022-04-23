import fs from "fs"
import path from "path";
import electron from "electron"

import WindowManager from "main/application/WindowManager"
import Application from "main/application/Application"

const FOLDER = "droply"

enum IpcEvent {
    Open = "file-storage:open",
    Write = "file-storage:write",
    Close = "file-storage:close"
}

export interface FileStoragePreload {
    open: (name: string) => Promise<number>
    close: (fd: number) => Promise<void>

    write: (fd: number, data: ArrayBufferView) => Promise<void>
}

export class FileStorage {
    private readonly windowManager: WindowManager

    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager
        this.setHandlers()
    }

    public static getPreload(): FileStoragePreload {
        return {
            async open(name: string): Promise<number> {
                return await electron.ipcRenderer.invoke(IpcEvent.Open, name)
            },

            async close(fd: number) {
                return await electron.ipcRenderer.invoke(IpcEvent.Close, fd)
            },

            async write(fd: number, data: ArrayBufferView) {
                return await electron.ipcRenderer.invoke(IpcEvent.Write, fd, data)
            },
        }
    }

    private handleOpen() {
        this.windowManager.handleInvoke(IpcEvent.Open, (name: string) => {
            return new Promise<number>(async (resolve, reject) => {
                // Creating all directories
                await this.makeDirs()

                let filename = path.resolve(Application.Instance.getApp().getPath("downloads"), FOLDER, name)

                fs.open(filename, "w+",
                    (err, fd) => err != null ? reject(err) : resolve(fd))
            })
        })
    }

    private handleWrite() {
        this.windowManager.handleInvoke(IpcEvent.Write, (fd: number, data: ArrayBufferView) => {
            return new Promise<void>((resolve, reject) => {
                fs.write(fd, data as NodeJS.ArrayBufferView, err => err != null ? reject(err) : resolve())
            })
        })
    }

    private handleClose() {
        this.windowManager.handleInvoke(IpcEvent.Close, (fd: number) => {
            return new Promise<void>((resolve, reject) => {
                fs.close(fd, err => err != null ? reject(err) : resolve())
            })
        })
    }

    private async makeDirs() {
        let dirpath = path.resolve(Application.Instance.getApp().getPath("downloads"), FOLDER)

        return new Promise<void>(((resolve, reject) => {
            fs.mkdir(dirpath, {recursive: true},
                (err) => err ? reject(err) : resolve())
        }))
    }

    private setHandlers() {
        this.handleOpen()
        this.handleClose()
        this.handleWrite()
    }
}
