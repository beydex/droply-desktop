import React, {useState} from 'react'
import Styles from './Window.module.scss'
import BaseHelper from 'renderer/helpers/BaseHelper'
import {Section} from './common/Section'
import {CodeInput} from './CodeInput'
import {SearchSection} from './SearchSection'
import {LocalNetwork} from './LocalNetwork'
import {SendButton} from './SendButton'
import {TransferHistory} from './History'
import {CodeRepository} from "renderer/repository/CodeRepository";
import {User} from "renderer/repository/UserRepository";

export function Window() {
    let [user, setUser] = useState<User>(null);

    async function onCode(code: number) {
        let user = await CodeRepository.Instance.findUser(code)
        setUser(user)
    }

    return (
        <div className={Styles.Container}>
            <Section subscript={'They will receive a notification'}>
                    <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                        arrow_back
                    </span>&nbsp;
                Choose a recipient
            </Section>
            <CodeInput onCode={onCode}/>
            <SearchSection user={user}/>
            <LocalNetwork/>
            <TransferHistory/>
            <SendButton/>
        </div>
    )
}
