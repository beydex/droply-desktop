import path from "path";

import {app, App} from "electron";

export default class Application {
    public static Instance: Application = new Application()
    private readonly app: App

    constructor() {
        this.app = app
    }

    public getApp(): App {
        return this.app
    }

    public async ready() {
        return new Promise<void>(resolve => {
            this.app.on("ready", () => {
                resolve()
            })
        })
    }

    public absolutePath(rootRelativePath: string): string {
        return path.join(this.app.getAppPath(), rootRelativePath)
    }
}
