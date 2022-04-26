import React from 'react'
import Styles from './Person.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper'

interface Props {
    name: string,
    avatar: string | React.ReactNode,

    hint?: React.ReactNode,
    action?: React.ReactNode,

    className?: string,

    onClick?: () => void
}

export function Person({name, avatar, hint, action, className, onClick}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Person, className)}>
            {
                typeof avatar == "string" ? (
                    <img alt=""
                         className={Styles.Avatar}
                         src={avatar}
                         onClick={() => onClick?.()}
                         draggable={false}/>
                ) : (
                    avatar
                )
            }

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
