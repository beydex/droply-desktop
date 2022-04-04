import React from 'react'
import {HistoryPerson} from '../../person/HistoryPerson'
import Styles from './HistorySection.module.scss'

import history_image1 from 'renderer/assets/images/Avatar3.png'
import history_image2 from 'renderer/assets/images/Avatar1.png'
import {Section} from "renderer/components/pages/main/workspace/recipent_window/common/Section";

export function HistorySection() {
    return (
        <Section title="History">
            <div className={Styles.List}>
                <HistoryPerson name='Me' hint='Send to your other devices'
                               avatar={history_image1}/>
                <HistoryPerson name='Konstantin Voronin' hint='Last transfer 3 days ago'
                               avatar={history_image2}/>
            </div>
        </Section>
    )
}
