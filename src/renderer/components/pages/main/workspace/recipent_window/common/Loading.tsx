import React from "react"
import Style from "./Loading.module.scss"

interface Props {
    text: string
}

export function Loading({text}: Props) {
    return (
        <div className={Style.Loading}>
            {text}
        </div>
    )
}
