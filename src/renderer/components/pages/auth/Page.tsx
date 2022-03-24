import React, {useEffect, useState} from "react"
import Styles from "./Page.module.scss"

import {Window} from "renderer/components/pages/auth/Window"
import BaseHelper from "renderer/helpers/BaseHelper";
import {AuthRepository} from "renderer/repository/AuthRepository";
import {useNavigate} from "react-router-dom";
import {AppRoting} from "renderer/components/App";

export function Page() {
    let navigate = useNavigate();

    let [actionHint, setActionHint] = useState<string>(null);
    let [errorHint, setErrorHint] = useState<string>(null);

    // Listening for deeplinks
    useEffect(() => window.externalApi.googleAuth.onToken(onGoogleAuthToken), [])

    async function onGoogleAuth() {
        await window.externalApi.googleAuth.openBrowser()
        setActionHint("Continuing in browser...")
    }

    async function onGoogleAuthToken(token) {
        setActionHint("Authenticating...")
        let result = await AuthRepository.Instance.authByGoogle(token)

        if (!result) {
            setErrorHint("Google authenticate failed, try again")
            return
        }

        navigate(AppRoting.MainScreen)
    }

    return (
        <div className={BaseHelper.classes(Styles.Page, Styles.Center)}>
            <Window actionHint={actionHint}
                    errorHint={errorHint}
                    onGoogleAuth={onGoogleAuth}/>

            <div className={Styles.Copyright}>
                © 2022, Beydex Team
            </div>
        </div>
    )
}
