import {Card} from './common/Card';
import React, {useEffect, useState} from 'react';
import {Empty} from "renderer/components/pages/main/sidebar/common/Empty";
import {TransferPerson} from "renderer/components/pages/main/person/TransferPerson";
import {Transfer, TransferRepository, TransferRepositoryEvent} from "renderer/repository/TransferRepository";

export function TransfersCard() {
    let [transfers, setTransfers] = useState<Transfer[]>([])

    useEffect(() => {
        TransferRepository.Instance.on(TransferRepositoryEvent.UPDATE, list)

        // Running first time
        list().then()
    }, [])

    async function list() {
        setTransfers(TransferRepository.Instance.list())
    }

    return (
        <Card
            name="Active transfers"
            description="Real-time uploads and downloads"
        >
            {
                transfers.length > 0
                    ? transfers.map(transfer =>
                        <TransferPerson key={transfer.request.id}
                                        transfer={transfer}/>
                    )
                    : <Empty/>
            }
        </Card>
    )
}
