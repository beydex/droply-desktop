import React from "react"
import Styles from "./Logo.module.scss"

import LogoImage from "renderer/assets/images/Logo.svg"

export function Logo() {
    return (
        <>
            <img className={Styles.Logo} src={LogoImage} alt=""/>
        </>
    )
}
