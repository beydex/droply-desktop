import React from "react"
import Styles from "./Page.module.scss"
import {AuthWindow} from "main/pages/auth/AuthWindow";

export function Page() {
  return (
    <div className={Styles.Root}>
      <AuthWindow/>

      <div className={Styles.Copyright}>
        © 2022, Beydex Team
      </div>
    </div>
  )
}
