import React from 'react'
import Styles from './Section.module.scss'

interface Props {
    title: string
    hint?: string
    children?: React.ReactNode
}

export function Section({title, hint, children}: Props) {
    return (
        <div className={Styles.Section}>
            <div className={Styles.Title}>
                {title}
            </div>

            {
                hint ? (
                    <div className={Styles.Hint}>
                        {hint}
                    </div>
                ) : (
                    <></>
                )
            }

            <div className={Styles.Margin}/>

            {
                children ? (
                    <div className={Styles.Margin}>
                        {children}
                    </div>
                ) : (
                    <></>
                )
            }
        </div>
    )
}
