import React from "react"
import Styles from "./HistoryPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {FullUser} from "renderer/repository/UserRepository";
import {Contact} from "renderer/repository/ContactsRepository";

interface Props {
    contact: Contact

    onClick?: (user: FullUser) => void
    onDelete?: (user: FullUser) => void
}

export function HistoryPerson({contact, onClick, onDelete}: Props) {
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
                <>
                    <span className={BaseHelper.classes(Styles.Options, Styles.MaterialIcon)}
                          onClick={() => onDelete?.(contact.user)}>
                        close
                    </span>
                </>
            }
            className={Styles.Person}
            onClick={() => onClick?.(contact.user)}
        />
    )
}
