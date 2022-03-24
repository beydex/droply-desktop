import {URL} from "url";
import {EventEmitter} from "events";

import Application from "main/application/Application";
import {Deeplink} from "electron-deeplink";
import WindowManager from "main/application/WindowManager";

const PROTOCOL = "droply";

export default class DeeplinkManager extends EventEmitter {
    private readonly windowManager: WindowManager
    private readonly deeplink: Deeplink

    constructor(windowManager: WindowManager) {
        super()
        this.windowManager = windowManager
        this.deeplink = this.createDeeplink()
    }

    private createDeeplink(): Deeplink {
        let deeplink = new Deeplink({
            app: Application.Instance.getApp(),
            mainWindow: this.windowManager.getWindow(),

            protocol: PROTOCOL,
        })

        deeplink.on("received", (...params) => {
            this.handleReceive(params)
        })

        return deeplink;
    }

    private handleReceive(params: string[]): void {
        for (let i = 0; i < params.length; i++) {
            if (params[i].startsWith(`${PROTOCOL}://`)) {
                this.handleLink(params[i]);
                break;
            }
        }
    }

    private handleLink(link: string): void {
        let parsedLink = new URL(link)
            .pathname
            .split("/")
            .filter(x => x.length > 0);

        // Link format: droply:///<handler>/<param1>/<param2>...
        if (parsedLink.length === 0) {
            return;
        }

        this.emit(parsedLink[0], ...parsedLink.slice(1))
    }
}
