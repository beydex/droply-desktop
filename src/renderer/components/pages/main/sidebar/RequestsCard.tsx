import {Card} from './common/Card';
import React, {useEffect, useState} from 'react';
import {RequestPerson} from "renderer/components/pages/main/person/RequestPerson";
import {
    Transfer,
    TransferRepository,
    TransferRepositoryEvent,
    TransferState
} from "renderer/repository/TransferRepository";
import {Empty} from "renderer/components/pages/main/sidebar/common/Empty";

export function RequestsCard() {
    let [transfers, setTransfers] = useState<Transfer[]>([])

    useEffect(() => {
        TransferRepository.Instance.on(TransferRepositoryEvent.UPDATE, listTransfers)

        // Running first time
        listTransfers().then()
    }, [])

    async function listTransfers() {
        setTransfers(TransferRepository.Instance.listTransfers(TransferState.REQUESTED))
    }

    async function onAccept(transfer: Transfer) {
        await TransferRepository.Instance.answerRequest(transfer.requestId, true)
    }

    async function onCancel(transfer: Transfer) {
        console.log("CANCELING")
        if (transfer.outgoing) {
            await TransferRepository.Instance.cancelRequest(transfer.requestId)
        } else {
            await TransferRepository.Instance.answerRequest(transfer.requestId, false)
        }
    }

    return (
        <Card
            name="Requests"
            description="Pending file transfer requests"
        >
            {
                transfers.length > 0
                    ? transfers.map(transfer =>
                        <RequestPerson key={transfer.requestId}
                                       transfer={transfer}
                                       onAccept={onAccept}
                                       onCancel={onCancel}/>
                    )
                    : <Empty/>
            }
        </Card>
    )
}
