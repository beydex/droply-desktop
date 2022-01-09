import React from "react"
import Styles from "./Window.module.scss"
import {Logo} from "web/components/Logo";
import {ServiceButton} from "web/pages/auth/ServiceButton";

import IconGoogle from "web/assets/images/IconGoogle.svg"
import IconApple from "web/assets/images/IconApple.svg"

export function Window() {
  return (
    <div className={Styles.Window}>
      <div className={Styles.Logo}>
        <Logo/>
      </div>

      <div className={Styles.Title}>
        Welcome to Droply!
      </div>

      <div className={Styles.TitleHint}>
        To continue, log into your account
      </div>

      <ServiceButton
        className={Styles.GoogleButton}
        icon={IconGoogle}
        text="Sign in with Google"/>

      <ServiceButton
        className={Styles.AppleButton}
        icon={IconApple}
        text="Sign in with Apple"/>

      <div className={Styles.Spacer}/>

      <div className={Styles.Legal}>
        By continuing, you agree to the
        <br/>
        <a href="https://intale.app">Terms of Service</a>
        &nbsp;and&nbsp;
        <a href="https://intale.app">Privacy Policy</a>
      </div>
    </div>
  )
}
