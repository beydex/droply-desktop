import {Card} from './common/Card';
import React from 'react';

import TestAvatar from 'renderer/assets/images/Avatar2.png';
import {RequestPerson} from "renderer/components/pages/main/person/RequestPerson";

export function RequestsCard() {
    return (
        <Card
            name="Requests"
            description="People who want to send you some files"
        >
            <RequestPerson name={"Joshua Marment"} avatar={TestAvatar} filesCount={3}/>
        </Card>
    )
}
