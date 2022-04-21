import React, {useEffect, useState} from 'react'
import Styles from './HistorySection.module.scss'
import {Section} from "renderer/components/pages/main/workspace/recipent_window/common/Section";
import {FullUser} from "renderer/repository/UserRepository";
import {Contact, ContactsRepository} from "renderer/repository/ContactsRepository";
import {HistoryPerson} from "renderer/components/pages/main/person/HistoryPerson";
import {Loading} from "renderer/components/pages/main/workspace/recipent_window/common/Loading";
import {RequestRepository} from "renderer/repository/RequestRepository";
import {FileRepository} from "renderer/repository/FileRepository";
import {useNavigate} from "react-router-dom";

export function HistorySection() {
    let navigate = useNavigate()
    let [contacts, setContacts] = useState<Contact[]>([])

    useEffect(() => {
        listContacts().then()
    }, [])

    async function listContacts() {
        setContacts(await ContactsRepository.Instance.listContacts())
    }

    async function deleteContact(user: FullUser) {
        await ContactsRepository.Instance.deleteContact(user.id)
        await listContacts()
    }

    async function sendRequest(user: FullUser) {
        await RequestRepository.Instance.createRequest(
            user,
            FileRepository.Instance.getFiles()
        )

        navigate("../")
    }

    return (
        <Section title="History">
            <div className={Styles.List}>
                {
                    contacts.length > 0
                        ? contacts.map(contact =>
                            <HistoryPerson
                                key={contact.user.id}
                                contact={contact}
                                onClick={sendRequest}
                                onDelete={deleteContact}/>
                        )
                        : <Loading text="Nothing here"/>
                }
            </div>
        </Section>
    )
}
