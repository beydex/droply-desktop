import React, {useEffect} from "react"
import Styles from "./App.module.scss"

import {Route, Routes, useNavigate} from "react-router-dom";
import {AuthRepository, AuthRepositoryEvent} from "renderer/repository/AuthRepository";

import {Page as AuthPage} from "renderer/components/pages/auth/Page";
import {Outlet as OutletPage} from "renderer/components/pages/outlet/Page";
import {Page as MainPage} from "renderer/components/pages/main/Page";

export class AppRoting {
    public static AuthScreen = "/auth"
    public static MainScreen = "/main"
}

export function App() {
    let navigate = useNavigate();

    useEffect(() => {
        navigate("/")

        setHandlers()
    }, [])

    function setHandlers() {
        AuthRepository.Instance.on(AuthRepositoryEvent.AUTH, () => {
            navigate(AppRoting.MainScreen)
        })

        AuthRepository.Instance.on(AuthRepositoryEvent.LOGOUT, () => {
            navigate(AppRoting.AuthScreen)
        })
    }

    return (
        <div className={Styles.App}>
            <Routes>
                <Route path={AppRoting.AuthScreen} element={<AuthPage/>}/>
                <Route path={AppRoting.MainScreen} element={<MainPage/>}/>

                <Route path="*" element={<OutletPage/>}/>
            </Routes>
        </div>
    )
}
