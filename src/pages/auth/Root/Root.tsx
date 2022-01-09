import React from "react"
import Styles from "./Root.module.scss"
import {Logo} from "src/pages/auth/Logo/Logo";
import {Window} from "src/pages/auth/Window/Window";

export function Root() {
  return (
    <div className={Styles.Root}>
      <Window/>
    </div>
  )
}
