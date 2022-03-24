import React from "react"
import Styles from "./Pointer.module.scss"

interface Props {
    children?: React.ReactNode
}

export function Pointer({children}: Props) {
    return (
        <div className={Styles.Pointer}>
            {children}
        </div>
    )
}

