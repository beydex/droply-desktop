import React from 'react'
import Styles from './Person.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper'

interface Props {
    name: string,
    avatar: string,

    hint?: React.ReactNode,
    action?: React.ReactNode,

    className?: string,

    onClick?: () => void
}

export function Person({name, avatar, hint, action, className, onClick}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Person, className)}>
            <img alt=""
                 className={Styles.Avatar}
                 src={avatar}
                 onClick={() => onClick?.()}/>

            <div className={Styles.Info}
                 onClick={() => onClick?.()}>
                <div className={BaseHelper.classes(Styles.Name, Styles.Ellipsis)}>
                    {name}
                </div>

                {hint}
            </div>

            {action}
        </div>
    )
}
