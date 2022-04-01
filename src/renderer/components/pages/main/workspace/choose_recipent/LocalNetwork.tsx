import React from 'react'
import { Subsection } from './Section'
import Styles from './LocalNetwork.module.scss'

export function LocalNetwork() {
    return (
        <>
        <Subsection title="Local network"/>
        <div className={Styles.Loading} >Finding more accounts in local area...</div>
        </>
    )
}