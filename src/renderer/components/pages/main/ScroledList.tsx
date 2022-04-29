import React from "react"
import Styles from "./ScroledList.module.scss"

interface Props {
    maxHeight?: number
    minHeight?: number
    children: React.ReactNode
}

export function ScroledList({children, maxHeight, minHeight}: Props) {

    let style = {}
    if (maxHeight !== null && maxHeight !== undefined) {
        style['maxHeight'] = maxHeight + 'px';
    }
    if (minHeight !== null && minHeight !== undefined) {
        style['minHeight'] = minHeight + 'px'
    }

    return (
        <div style={style} className={Styles.ScroledList}>
            {children}
        </div>
    )
}
