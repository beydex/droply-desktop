import React, {useEffect, useRef} from "react"
import Styles from "./AuthWindow.module.scss"
import {Logo} from "main/components/Logo";
import {ServiceButton} from "main/pages/auth/ServiceButton";

import IconGoogle from "main/assets/images/IconGoogle.svg"
import IconApple from "main/assets/images/IconApple.svg"

import {animate} from "main/utils";

// Animation constants
const LOGO_ANIMATION_DELAY = 1000
const LOGO_ANIMATION_DURATION = 0.5

const CONTENT_ANIMATION_DELAY = 1500
const CONTENT_ANIMATION_DURATION = 0.5

export function AuthWindow() {
  let windowRef = useRef();
  let logoRef = useRef();
  let contentRef = useRef();

  useEffect(() => {
    // First animating logo
    animateLogo(logoRef.current)

    // Then animating content
    animateContent(windowRef.current, contentRef.current)
  }, [])


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
    </div>
  )
}

function animateLogo(logo) {
  animate(logo, LOGO_ANIMATION_DELAY, {
    height: "150px",
    width: "150px",
    marginTop: "30px",

    duration: LOGO_ANIMATION_DURATION,
    ease: "expo.inOut"
  })
}

function animateContent(window, content) {
  animate(window, CONTENT_ANIMATION_DELAY, {
    borderWidth: 1,

    duration: CONTENT_ANIMATION_DURATION,
    ease: "expo.out"
  })

  animate(content, CONTENT_ANIMATION_DELAY, {
    opacity: 1,

    duration: CONTENT_ANIMATION_DURATION,
    ease: "expo.out"
  })
}
