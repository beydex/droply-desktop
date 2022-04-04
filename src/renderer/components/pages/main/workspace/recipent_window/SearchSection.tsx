import React, {useEffect, useState} from 'react'
import {SearchPerson} from '../../person/SearchPerson'
import {User} from "renderer/repository/UserRepository";
import {Section} from "renderer/components/pages/main/workspace/recipent_window/common/Section";

interface Props {
    user?: User
}

export function SearchSection(props: Props) {
    let [user, setUser] = useState<User>(null)

    useEffect(() => {
        setUser(props.user)
    }, [props.user])

    return (
        <Section name="Search results">
            {
                user
                    ? <SearchPerson name={user.name} avatar={user.avatarUrl} selected={false}/>
                    : <div>To search users, enter code above</div>
            }
        </Section>
    )
}
