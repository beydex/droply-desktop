import React from 'react'
import { HistoryPerson } from '../../person/HistoryPerson'
import { Subsection } from './common/Section'
import Styles from './History.module.scss'

import history_image1 from 'renderer/assets/images/Avatar3.png'
import history_image2 from 'renderer/assets/images/Avatar1.png'

export function TransferHistory() {
    return (
        <>
        <Subsection title="History"/>
        <div className={Styles.HistoryList} >
            <HistoryPerson className={Styles.HistoryElement} 
                           name='Me' hint='Send to your other devices' 
                           avatar={history_image1} />
            <HistoryPerson className={Styles.HistoryElement} 
                           name='Konstantin Voronin' hint='Last transfer 3 days ago' 
                           avatar={history_image2} />
        </div>
        </>
    )
}
