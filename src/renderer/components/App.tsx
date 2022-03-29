import React, {useEffect} from "react"
import Styles from "./App.module.scss"

import {Route, Routes, useNavigate} from "react-router-dom";
import {AuthRepository} from "renderer/repository/AuthRepository";

import {Page as AuthPage} from "renderer/components/pages/auth/Page";
import {Initial as OutletPage} from "renderer/components/pages/initial/Page";
import {Page as MainPage} from "renderer/components/pages/main/Page";
import WebsocketHelper, {WebsocketHelperEvent} from "renderer/helpers/WebsocketHelper";

export class AppRoting {
    public static InitialScreen = "/"

    public static AuthScreen = "/auth"
    public static MainScreen = "/main"
}

export function App() {
    let navigate = useNavigate();

    useEffect(() => {
        navigate(AppRoting.InitialScreen)

        chooseScreen().then()
    }, [])

    async function chooseScreen() {
        WebsocketHelper.Instance.on(WebsocketHelperEvent.OPEN, async () => {
            navigate(
                await AuthRepository.Instance.authByToken()
                    ? AppRoting.MainScreen
                    : AppRoting.AuthScreen
            )
        })
    }

    return (
        <div className={Styles.App}>
            <Routes>
                <Route path={AppRoting.InitialScreen} element={<OutletPage/>}/>
                <Route path={AppRoting.AuthScreen} element={<AuthPage/>}/>
                <Route path={AppRoting.MainScreen} element={<MainPage/>}/>
            </Routes>
        </div>
    )
}
