import React from "react"
import Styles from "./ScrolledList.module.scss"

interface Props {
    maxHeight?: number
    minHeight?: number
    children: React.ReactNode
}

export function ScrolledList({children, maxHeight, minHeight}: Props) {

    let style = {}
    if (maxHeight !== null && maxHeight !== undefined) {
        style['maxHeight'] = maxHeight + 'vh';
    }
    if (minHeight !== null && minHeight !== undefined) {
        style['minHeight'] = minHeight + 'vh'
    }

    return (
        <div style={style} className={Styles.ScroledList}>
            {children}
        </div>
    )
}
