import React from "react"
import Styles from "./Page.module.scss"
import BaseHelper from "renderer/helpers/BaseHelper";
import {Logo} from "renderer/components/Logo";

export function Outlet() {
    return (
        <div className={BaseHelper.classes(Styles.Page, Styles.Center)}>
            <div className={Styles.Logo}>
                <Logo/>
            </div>
        </div>
    )
}
