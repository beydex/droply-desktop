import React from 'react'
import Styles from './Person.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper'

interface Props {
    name: string,
    avatar: string,

    hint?: React.ReactNode,
    action?: React.ReactNode,
}

export function Person({name, avatar, hint, action}: Props) {
    return (
        <div className={Styles.Person}>
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
