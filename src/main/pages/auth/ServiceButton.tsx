import React from "react"
import Styles from "./ServiceButton.module.scss"
import {classes} from "main/utils";

interface Props {
  icon: string
  text: string

  className?: string
}

export function ServiceButton({icon, text, className}: Props) {
  return (
    <div className={classes(Styles.ServiceButton, className)}>
      <img src={icon} alt=""/>

      <div className={Styles.Text}>
        {text}
      </div>

      <div className={Styles.Spacer}/>

      <span className={Styles.MaterialIcon}>
        east
      </span>
    </div>
  )
}
