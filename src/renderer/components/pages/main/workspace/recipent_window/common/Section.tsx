import React from 'react'
import Styles from './Section.module.scss'

interface Props {
    name: string
    children?: React.ReactNode
}

export function Section({name, children}: Props) {
    return (
        <div>
            <div className={Styles.Subsection}>
                {name}
            </div>

            {children}
        </div>
    )
}
