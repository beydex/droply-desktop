import React, {useEffect} from "react"
import Styles from "./App.module.scss"

import {Route, Routes, useNavigate} from "react-router-dom";
import {AuthRepository, AuthRepositoryEvent} from "renderer/repository/AuthRepository";

import {Page as AuthPage} from "renderer/components/pages/auth/Page";
import {Outlet as OutletPage} from "renderer/components/pages/outlet/Page";
import {Page as MainPage} from "renderer/components/pages/main/Page";

export class AppRoting {
    public static Auth = "/auth"
    public static Main = "/main"
}

export function App() {
    let navigate = useNavigate();

    useEffect(() => {
        setHandlers()
    }, [])

    function setHandlers() {
        AuthRepository.Instance.on(AuthRepositoryEvent.AUTH, () => {
            navigate(AppRoting.Main)
        })

        AuthRepository.Instance.on(AuthRepositoryEvent.LOGOUT, () => {
            navigate(AppRoting.Auth)
        })
    }

    return (
        <div className={Styles.App}>
            <Routes>
                <Route index element={<OutletPage/>}/>
                <Route path={AppRoting.Auth} element={<AuthPage/>}/>
                <Route path={AppRoting.Main + "/*"} element={<MainPage/>}/>
            </Routes>
        </div>
    )
}
