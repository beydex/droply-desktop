import React from 'react'
import Styles from './Section.module.scss'

interface Props {
    title: string
    children?: React.ReactNode
}

export function Section({title, children}: Props) {
    return (
        <div className={Styles.Section}>
            <div className={Styles.Title}>
                {title}
            </div>

            {children}
        </div>
    )
}
