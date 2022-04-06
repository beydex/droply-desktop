import React from 'react'
import {HistoryPerson} from '../../person/HistoryPerson'
import Styles from './FilesSection.module.scss'

import history_image1 from 'renderer/assets/images/Avatar3.png'
import history_image2 from 'renderer/assets/images/Avatar1.png'
import {Section} from "renderer/components/pages/main/workspace/recipent_window/common/Section";
import { FilePerson } from '../../person/FilePerson'
import BaseHelper from 'renderer/helpers/BaseHelper'

export function FilesSection() {
    let file_icon: React.ReactNode = <div className={Styles.File}>
        <span className={BaseHelper.classes(Styles.FileIcon, Styles.MaterialIcon)}>
            folder
        </span>
    </div>

    return (
        <Section title="Files">
            <div className={Styles.List}>
                    <FilePerson name="My homework" avatar={file_icon} size={16.01} filesCount={14} percent={98} />
                    <FilePerson name="Work" avatar={file_icon} size={18.05} filesCount={5} percent={56} />
            </div>
        </Section>
    )
}
