import React from 'react'
import Styles from './UserSection.module.scss'

import history_image1 from 'renderer/assets/images/Avatar3.png'
import {Section} from "renderer/components/pages/main/workspace/recipent_window/common/Section";
import { DownloadPerson } from '../../person/DownloadPerson'

export function UserSection() {
    return (
        <Section title="User">
            <DownloadPerson 
                name="Barley Lightfoot" 
                avatar={history_image1}
                speed={45}
                time={5}
                />
        </Section>
    )
}
