import React from "react"
import Styles from "./SearchPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";

interface Props {
    name: string
    avatar: string

    selected: boolean
}

export function SearchPerson({name, avatar, selected}: Props) {
    let icon;
    if (selected) {
        icon = <span className={BaseHelper.classes(Styles.Selected, Styles.MaterialIcon)}>
            check_circle
        </span>
    }
    return (
        <Person
            name={name}
            avatar={avatar}
            action={icon} 
            className={Styles.Person} />
    )
}
