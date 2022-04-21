import React from "react"
import Styles from "./SearchPerson.module.scss";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {User} from "renderer/repository/UserRepository";
import {useNavigate} from "react-router-dom";
import {RequestRepository} from "renderer/repository/RequestRepository";

interface Props {
    user: User
}

export function SearchPerson({user}: Props) {
    let navigate = useNavigate()

    async function onRequest() {
        await RequestRepository.Instance.createRequest(user)
        navigate("../")
    }

    return (
        <Person
            name={user.name}
            avatar={user.avatarUrl}
            className={Styles.Person}
            onClick={onRequest}/>
    )
}
