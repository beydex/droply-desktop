import React from "react"
import Styles from "./HistoryPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {Contact, ContactsRepository} from "renderer/repository/ContactsRepository";
import {RequestRepository} from "renderer/repository/RequestRepository";
import {useNavigate} from "react-router-dom";

interface Props {
    contact: Contact
}

export function HistoryPerson({contact}: Props) {
    let navigate = useNavigate()

    async function onRequest() {
        await RequestRepository.Instance.createRequest(contact.user)
        navigate("../")
    }

    async function onDelete() {
        await ContactsRepository.Instance.deleteContact(contact.user.id)
    }

    return (
        <Person
            name={contact.user.name}
            avatar={contact.user.avatarUrl}
            hint={
                <div className={Styles.Hint}>
                    Last sent {new Date(contact.lastSuccessRequestDate.split("[")[0]).toDateString()}
                </div>
            }
            action={
                <span className={BaseHelper.classes(Styles.Options, Styles.MaterialIcon)}
                      onClick={onDelete}>
                    close
                </span>
            }
            className={Styles.Person}
            onClick={onRequest}
        />
    )
}
