import React from "react"
import Styles from "./HistoryPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";

interface Props {
    name: string,
    avatar: string,
    hint: string,

    className?: string,
}

export function HistoryPerson({name, avatar, hint, className}: Props) {
    return (
        <Person
            name={name}
            avatar={avatar}
            hint={
                <div className={Styles.Hint}>
                    {hint}
                </div>
            }
            action={
                <>
                    <span className={BaseHelper.classes(Styles.Options, Styles.MaterialIcon)}>
                        more_vert
                    </span>
                </>
            }
            className={BaseHelper.classes(Styles.HistoryPerson, className)}
            />
    )
}
