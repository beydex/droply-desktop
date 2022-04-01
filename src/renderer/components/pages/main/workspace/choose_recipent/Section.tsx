import React from 'react'
import Styles from './Section.module.scss'


export function Section({children, subscript}) {
    return (
        <>
        <div className={Styles.Section}>
            {children}
        </div>
        <div className={Styles.Subscript}>
            {subscript}
        </div>
        </>
    )
}

export function Subsection({title}) {
    return (
        <div className={Styles.Subsection}>
            {title}
        </div>
        
    )
}
