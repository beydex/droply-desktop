import React from "react"
import Styles from "./Window.module.scss"
import {Logo} from "src/pages/auth/Logo/Logo";

export function Window() {
  return (
    <div className={Styles.Window}>
      <div className={Styles.Logo}>
        <Logo/>
      </div>

      <div>
        Welcome
      </div>
    </div>
  )
}
