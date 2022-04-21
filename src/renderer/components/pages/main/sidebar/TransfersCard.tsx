import {Card} from './common/Card';
import React, {useEffect, useState} from 'react';
import {Empty} from "renderer/components/pages/main/sidebar/common/Empty";
import {TransferPerson} from "renderer/components/pages/main/person/TransferPerson";
import {Request, RequestRepository, RequestRepositoryEvent, RequestState} from "renderer/repository/RequestRepository";

export function TransfersCard() {
    let [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        RequestRepository.Instance.on(RequestRepositoryEvent.UPDATE, list)

        // Running first time
        list().then()
    }, [])

    async function list() {
        setRequests(
            RequestRepository.Instance
                .listRequests([
                    RequestState.EXCHANGING,
                    RequestState.ACTIVE,
                    RequestState.DONE,
                    RequestState.ERROR
                ])
        )
    }

    return (
        <Card
            name="Active transfers"
            description="Real-time uploads and downloads"
        >
            {
                requests.length > 0
                    ? requests.map(request =>
                        <TransferPerson key={request.id}
                                        request={request}/>
                    )
                    : <Empty/>
            }
        </Card>
    )
}
