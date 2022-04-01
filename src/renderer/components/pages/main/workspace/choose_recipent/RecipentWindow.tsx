import React, {useState} from 'react'
import Styles from './RecipentWindow.module.scss'
import BaseHelper from 'renderer/helpers/BaseHelper'
import { Section } from './Section'
import { CodeInput } from './CodeInput'
import { Search } from './Search'
import { LocalNetwork } from './LocalNetwork'
import { SendButton } from './SendButton'
import { TransferHistory } from './History'

export function RecipentWindow() {
    return (
        <div className={Styles.Container}>
            <Section subscript={'They will receive a notification'}>
                    <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                        arrow_back
                    </span>&nbsp;
                    Choose a recipient
            </Section>
            <CodeInput/>
            <Search/>
            <LocalNetwork/>
            <TransferHistory/>
            <SendButton/>
        </div>
    )
}
