import React, {useEffect, useState} from 'react'
import Styles from './HistorySection.module.scss'
import {Section} from "renderer/components/pages/main/workspace/recipent_window/common/Section";
import {Contact, ContactRepositoryEvent, ContactsRepository} from "renderer/repository/ContactsRepository";
import {HistoryPerson} from "renderer/components/pages/main/person/HistoryPerson";
import {Loading} from "renderer/components/pages/main/workspace/recipent_window/common/Loading";

export function HistorySection() {
    let [contacts, setContacts] = useState<Contact[]>([])

    useEffect(() => {
        ContactsRepository.Instance.on(ContactRepositoryEvent.UPDATE, list)

        // Running first time
        list().then()
    }, [])

    async function list() {
        setContacts(await ContactsRepository.Instance.listContacts())
    }

    return (
        <Section title="History">
            <div className={Styles.List}>
                {
                    contacts.length > 0
                        ? contacts.map(contact =>
                            <HistoryPerson
                                key={contact.user.id}
                                contact={contact}/>
                        )
                        : <Loading text="Nothing here"/>
                }
            </div>
        </Section>
    )
}
