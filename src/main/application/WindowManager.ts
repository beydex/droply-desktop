import electron, {BrowserWindow} from "electron";

import * as constants from "main/constants";
import Application from "main/application/Application";

export default class WindowManager {
    private readonly window: BrowserWindow
    private windowLoaded: boolean

    constructor() {
        this.window = WindowManager.createWindow()
        this.windowLoaded = false
    }

    private static createWindow(): BrowserWindow {
        return new BrowserWindow({
            width: constants.WINDOW_WIDTH,
            minWidth: constants.WINDOW_WIDTH,

            height: constants.WINDOW_HEIGHT,
            minHeight: constants.WINDOW_HEIGHT,

            autoHideMenuBar: true,

            webPreferences: {
                preload: Application.Instance.absolutePath(constants.WINDOW_PRELOAD_FILE),
            }
        })
    }

    public getWindow(): BrowserWindow {
        return this.window
    }

    public async load(): Promise<void> {
        if (!this.windowLoaded) {
            await this.window.loadFile(constants.WINDOW_HTML_FILE)

            this.windowLoaded = true
        }
    }

    public send(channel: string, ...args: any[]) {
        this.window.webContents.send(channel, ...args)
    }

    public handleInvoke(channel: string, callback: (...args: any[]) => any) {
        electron.ipcMain.handle(channel, (event, ...args) => {
            return callback(...args);
        })
    }
}
