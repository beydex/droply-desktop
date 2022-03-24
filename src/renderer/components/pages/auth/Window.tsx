import React, {useEffect, useRef} from "react"
import Styles from "./Window.module.scss"

import gsap from "gsap";

import {Logo} from "renderer/components/Logo";
import {Button} from "renderer/components/pages/auth/Button";

import IconGoogle from "renderer/assets/images/IconGoogle.svg"
import BaseHelper from "renderer/helpers/BaseHelper";

const ANIMATION_DELAY = 1000

interface Props {
    actionHint?: string
    errorHint?: string
    onGoogleAuth?: () => void
}

export function Window({actionHint, errorHint, onGoogleAuth}: Props) {
    let windowRef = useRef();
    let logoRef = useRef();
    let contentRef = useRef();

    useEffect(runAnimation, [])

    function runAnimation() {
        let timeline = gsap.timeline()

        timeline.to(logoRef.current, {
            transform: "scale(1) translateY(0)",

            ease: "expo.out",
            duration: 0.5,
        }, "logo")

        timeline.to(contentRef.current, {
            opacity: 1,

            ease: "expo.out",
            duration: 0.5,
        }, "logo+=0.3")

        timeline.to(windowRef.current, {
            borderWidth: 1,

            ease: "expo.out",
            duration: 0.5,
        }, "logo+=0.3")
    }

    return (
        <div className={Styles.Window}
             ref={windowRef}>

            <div className={Styles.Logo}
                 ref={logoRef}>
                <Logo/>
            </div>

            <div className={Styles.Content}
                 ref={contentRef}>

                <div className={Styles.Title}>
                    Welcome to Droply!
                </div>

                <div className={BaseHelper.classes(
                    actionHint ? Styles.HintAction : (errorHint ? Styles.HintError : ""),
                    Styles.Hint
                )}>
                    {actionHint ? actionHint : (errorHint ? errorHint : "To continue, log into your account")}
                </div>

                <Button
                    className={Styles.GoogleButton}
                    icon={IconGoogle}
                    text="Sign in with Google"
                    onClick={onGoogleAuth}/>

                <div className={Styles.Spacer}/>

                <div className={Styles.Legal}>
                    By continuing, you agree to the
                    <br/>
                    <a href="https://intale.app">Terms of Service</a>
                    &nbsp;and&nbsp;
                    <a href="https://intale.app">Privacy Policy</a>
                </div>
            </div>
        </div>
    )
}

