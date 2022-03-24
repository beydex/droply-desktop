import React from "react"
import Styles from "./Button.module.scss"
import BaseHelper from "renderer/helpers/BaseHelper";

interface Props {
    icon: string
    text: string

    className?: string
    onClick?: () => void
}

export function Button({icon, text, className, onClick}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Button, className)}
             onClick={onClick}>
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
