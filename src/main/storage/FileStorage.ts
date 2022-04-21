import WindowManager from "main/application/WindowManager";

enum IpcEvent {
    Open = "open"
}

export interface FileStoragePreload {

}

export class FileStorage {
    private readonly windowManager: WindowManager

    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager
        this.setHandlers()
    }

    public static getPreload(): FileStoragePreload {
        return {}
    }

    private handleOpenFile() {
        this.windowManager.handleInvoke(IpcEvent.Open, (name: string) => {
            return new Promise<void>((resolve, reject) => {

            })
        })
    }

    private setHandlers() {

    }
}
