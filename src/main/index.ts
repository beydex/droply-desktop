import Application from "main/application/Application";
import {GoogleAuth} from "main/auth/GoogleAuth";
import WindowManager from "main/application/WindowManager";
import DeeplinkManager from "main/application/DeeplinkManager";
import {TokenStorage} from "main/storage/TokenStorage";

Application.Instance
    .ready()
    .then(async () => {
        let windowManager = new WindowManager()
        let deeplinkManager = new DeeplinkManager(windowManager)

        // Initializing services
        new GoogleAuth(windowManager, deeplinkManager)
        new TokenStorage(windowManager)

        // Loading window
        await windowManager.load()
    })
