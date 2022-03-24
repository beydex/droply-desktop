import React, {useEffect} from "react"
import Styles from "./App.module.scss"

import {Route, Routes, useNavigate} from "react-router-dom";
import {AuthRepository} from "renderer/repository/AuthRepository";

import {Page as AuthPage} from "renderer/components/pages/auth/Page";
import {Page as OutletPage} from "renderer/components/pages/outlet/Page";
import {Page as MainPage} from "renderer/components/pages/main/Page";
import BaseHelper from "renderer/helpers/BaseHelper";
import WebsocketHelper from "renderer/helpers/WebsocketHelper";

const CHOOSE_SCREEN_TIMEOUT = 500

export class AppRoting {
    public static AuthScreen = "/auth"
    public static MainScreen = "/main"
}

export function App() {
    let navigate = useNavigate();

    useEffect(() => {
        chooseScreen().then(() => {
            // Ignore
        })
    }, [])

    async function chooseScreen() {
        // Waiting for connection establishment and small timeout
        await Promise.all([
            BaseHelper.timeout(CHOOSE_SCREEN_TIMEOUT),
            WebsocketHelper.Instance.waitOpen()
        ])

        navigate(
            await AuthRepository.Instance.authByToken()
                ? AppRoting.MainScreen
                : AppRoting.AuthScreen
        )
    }

    return (
        <div className={Styles.App}>
            <Routes>
                <Route path={AppRoting.AuthScreen} element={<AuthPage/>}/>
                <Route path={AppRoting.MainScreen} element={<MainPage/>}/>

                {/* Default initial page */}
                <Route path={"*"} element={<OutletPage/>}/>
            </Routes>
        </div>
    )
}
