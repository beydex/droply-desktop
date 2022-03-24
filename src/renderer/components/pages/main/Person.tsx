import React from 'react'
import Styles from './Person.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper'
import {Pointer} from "renderer/components/utility/Pointer";

interface Props {
    avatar: string,
    name: string,
    subscript: React.ReactNode,
    children?: React.ReactNode,
    className?: string
}

export function Person({avatar, name, subscript, children, className}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Person, className)}>
            <Pointer>
                <img className={Styles.Avatar} src={avatar} alt=""/>
            </Pointer>

            <div className={Styles.Info}>
                <Pointer>
                    <div className={Styles.Name}>{name}</div>
                </Pointer>

                <div className={Styles.Subscript}>{subscript}</div>
            </div>

            {children}
        </div>
    )
}
