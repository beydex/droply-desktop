import React from 'react'
import Styles from './Person.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper'

interface Props {
    name: string,
    avatar: string,

    hint?: React.ReactNode,
    action?: React.ReactNode,

    className?: string,
}

export function Person({name, avatar, hint, action, className}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Person, className)}>
            <img className={Styles.Avatar} src={avatar} alt=""/>

            <div className={Styles.Info}>
                <div className={BaseHelper.classes(Styles.Name, Styles.Ellipsis)}>
                    {name}
                </div>

                {hint}
            </div>

            {action}
        </div>
    )
}
