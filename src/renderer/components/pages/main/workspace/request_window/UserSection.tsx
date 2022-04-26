import React from 'react'

import {Section} from "renderer/components/pages/main/workspace/request_window/common/Section";
import {DownloadPerson} from 'renderer/components/pages/main/person/DownloadPerson'
import {Request} from "renderer/repository/RequestRepository";

interface Props {
    request: Request
}

export function UserSection({request}: Props) {
    return (
        <Section title="User">
            <DownloadPerson request={request}/>
        </Section>
    )
}
