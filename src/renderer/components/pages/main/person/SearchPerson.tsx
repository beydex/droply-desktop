import React from "react"
import Styles from "./SearchPerson.module.scss";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {User} from "renderer/repository/UserRepository";

interface Props {
    user: User
}

export function SearchPerson({user}: Props) {
    return (
        <Person
            name={user.name}
            avatar={user.avatarUrl}
            className={Styles.Person}/>
    )
}
