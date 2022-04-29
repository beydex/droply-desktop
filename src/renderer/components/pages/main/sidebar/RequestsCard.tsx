import {Card} from './common/Card';
import React, {useEffect, useState} from 'react';
import {RequestPerson} from "renderer/components/pages/main/person/RequestPerson";
import {Request, RequestRepository, RequestRepositoryEvent, RequestState} from "renderer/repository/RequestRepository";
import {Empty} from "renderer/components/pages/main/sidebar/common/Empty";
import { ScroledList } from '../ScroledList';

export function RequestsCard() {
    let [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        RequestRepository.Instance.on(RequestRepositoryEvent.UPDATE, list)

        // Running first time
        list().then()
    }, [])

    async function list() {
        setRequests(RequestRepository.Instance.listRequests([RequestState.CREATED]))
    }

    return (
        <Card
            name="Requests"
            description="Pending file transfer requests"
        >
            {
                requests.length > 0
                    ? requests.map(request =>
                        <RequestPerson key={request.id}
                                        request={request}/>
                    )
                    : <Empty/>
            }
        </Card>
    )
}
