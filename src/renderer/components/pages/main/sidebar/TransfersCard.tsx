import {Card} from './common/Card';
import React from 'react';

import icon from 'renderer/assets/images/Avatar3.png';
import {TransferPerson} from "renderer/components/pages/main/person/TransferPerson";

export function TransfersCard() {
    return (
        <Card
            name="Active transfers"
            description="Real-time uploads and downloads"
        >
            <TransferPerson avatar={icon} name='Joshua Marment' filesCount={5}/>
        </Card>
    )
}
