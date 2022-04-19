import React, {useState} from 'react'
import {SearchPerson} from '../../person/SearchPerson'
import {User} from "renderer/repository/UserRepository";
import {Section} from "renderer/components/pages/main/workspace/recipent_window/common/Section";
import {CodeInput} from "renderer/components/pages/main/workspace/recipent_window/CodeInput";
import {CodeRepository} from "renderer/repository/CodeRepository";
import {Loading} from "renderer/components/pages/main/workspace/recipent_window/common/Loading";

export function SearchSection() {
    let [user, setUser] = useState<User>(null);
    let [loading, setLoading] = useState<string>("To search users enter code above")

    async function onCode(code: number) {
        let user = await CodeRepository.Instance.findUser(code)
        if (user == null) {
            setLoading("User not found")
        }

        setUser(user)
    }

    return (
        <Section title="Search">
            <CodeInput onCode={onCode}/>
            {
                user
                    ? <SearchPerson user={user}/>
                    : <Loading text={loading}/>
            }
        </Section>
    )
}
