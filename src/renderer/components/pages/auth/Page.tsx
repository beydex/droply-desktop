import React, {useEffect, useRef, useState} from "react"
import Styles from "./Page.module.scss"

import {Window} from "renderer/components/pages/auth/Window"
import BaseHelper from "renderer/helpers/BaseHelper";
import {AuthRepository} from "renderer/repository/AuthRepository";
import {AppRoting} from "renderer/components/App";

import {useNavigate} from "react-router-dom";

const AUTH_DELAY = 1000

export function Page() {
    let pageRef = useRef();

    let navigate = useNavigate();

    let [actionHint, setActionHint] = useState<string>(null);
    let [errorHint, setErrorHint] = useState<string>(null);

    useEffect(() => {
        window.externalApi.googleAuth.onToken(onGoogleAuthToken)
    }, [])

    async function onGoogleAuth() {
        await window.externalApi.googleAuth.openBrowser()
        setActionHint("Continuing in browser...")
    }

    async function onGoogleAuthToken(token: string) {
        setActionHint("Authenticating...")
        let result = await Promise.all([
            AuthRepository.Instance.authByGoogle(token),
            BaseHelper.timeout(AUTH_DELAY)
        ])

        if (!result[0]) {
            setErrorHint("Google authenticate failed, try again")
            return
        }

        navigate(AppRoting.MainScreen)
    }

    return (
        <div ref={pageRef} className={BaseHelper.classes(Styles.Page, Styles.Center)}>
            <Window actionHint={actionHint}
                    errorHint={errorHint}
                    onGoogleAuth={onGoogleAuth}/>

            <div className={Styles.Copyright}>
                © 2022, Beydex Team
            </div>
        </div>
    )
}
