import React from 'react'
import Styles from './Person.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper'

interface Props {
    name: string,
    avatar: string | React.ReactNode,

    hint?: React.ReactNode,
    action?: React.ReactNode,

    className?: string,
}

export function Person({name, avatar, hint, action, className}: Props) {
    let logo: React.ReactNode;
    if (typeof avatar == 'string') {
        logo = <img className={Styles.Avatar} src={avatar} alt=""/>;
    } else {
        logo = avatar as React.ReactNode;
    }
    return (
        <div className={BaseHelper.classes(Styles.Person, className)}>
            {logo}

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
