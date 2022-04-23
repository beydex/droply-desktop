import electron from "electron";
import {GoogleAuth, GoogleAuthPreload} from "main/auth/GoogleAuth";
import {TokenStorage, TokenStoragePreload} from "main/storage/TokenStorage";
import {FileStorage, FileStoragePreload} from "main/storage/FileStorage";

export interface ExternalApi {
    googleAuth: GoogleAuthPreload
    tokenStorage: TokenStoragePreload
    fileStorage: FileStoragePreload
}

declare global {
    interface Window {
        externalApi: ExternalApi
    }
}

electron
    .contextBridge
    .exposeInMainWorld("externalApi", constructExternal())

function constructExternal(): ExternalApi {
    return {
        googleAuth: GoogleAuth.getPreload(),
        tokenStorage: TokenStorage.getPreload(),
        fileStorage: FileStorage.getPreload(),
    }
}

