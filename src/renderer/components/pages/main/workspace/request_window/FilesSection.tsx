import React from 'react'
import Styles from './FilesSection.module.scss'
import {Request} from "renderer/repository/RequestRepository";
import {FilePerson} from "renderer/components/pages/main/person/FilePerson";
import {Section} from "renderer/components/pages/main/workspace/request_window/common/Section";
import { ScroledList } from '../../ScroledList';

interface Props {
    request: Request
}

export function FilesSection({request}: Props) {
    let statistics = request.getStatistics()

    return (
        <Section title="Files" hint={`Total ${request.files.length} file(s)`}>
            <div className={Styles.List}>
                <ScroledList maxHeight={500} minHeight={150}>
                    {
                        statistics == null ? (
                            request.files.map((file, index) =>
                                <FilePerson key={index} file={file} transferredSize={0}/>)
                        ) : (
                            statistics.files.map((file, index) =>
                                <FilePerson key={index} file={file.inner} transferredSize={file.transferredSize}/>)
                        )
                    }
                </ScroledList>
            </div>
        </Section>
    )
}
