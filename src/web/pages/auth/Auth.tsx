import React from "react"
import Styles from "./Auth.module.scss"
import {Window} from "web/pages/auth/Window";

export function Auth() {
  return (
    <div className={Styles.Root}>
      <Window/>
    </div>
  )
}
