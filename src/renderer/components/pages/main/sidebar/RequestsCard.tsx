import {Card} from './common/Card';
import React, {useEffect, useState} from 'react';
import {RequestPerson} from "renderer/components/pages/main/person/RequestPerson";
import {Request, RequestRepository, RequestRepositoryEvent} from "renderer/repository/RequestRepository";
import {Empty} from "renderer/components/pages/main/sidebar/common/Empty";

export function RequestsCard() {
    let [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        RequestRepository.Instance.on(RequestRepositoryEvent.UPDATE, list)

        // Running first time
        list().then()
    }, [])

    async function list() {
        setRequests(RequestRepository.Instance.list())
    }

    async function onAccept(request: Request) {
        await RequestRepository.Instance.answerRequest(request.id, true)
    }

    async function onCancel(request: Request) {
        if (request.outgoing) {
            await RequestRepository.Instance.cancelRequest(request.id)
        } else {
            await RequestRepository.Instance.answerRequest(request.id, false)
        }
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
                                       request={request}
                                       onAccept={onAccept}
                                       onCancel={onCancel}/>
                    )
                    : <Empty/>
            }
        </Card>
    )
}
