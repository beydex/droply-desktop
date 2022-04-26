import React from "react"
import Styles from "./FilePerson.module.scss";
import {Person} from "renderer/components/pages/main/person/common/Person";
import BaseHelper from "renderer/helpers/BaseHelper";
import {FileDescription} from "renderer/repository/FileRepository";
import {MetricHelper} from "renderer/helpers/MetricHelper";

interface Props {
    file: FileDescription
    transferredSize: number
}

function formatSize(size: number) {
    return `${(size / 1024 / 1024).toFixed(1)} Mb`
}

export function FilePerson({file, transferredSize}: Props) {
    return (
        <Person
            name={file.name}
            avatar={
                <div className={Styles.File}>
                    <span className={BaseHelper.classes(Styles.FileIcon, Styles.MaterialIcon)}>
                        folder
                    </span>
                </div>
            }

            hint={
                <div className={Styles.Hint}>
                    {
                        transferredSize != 0 ? <>{MetricHelper.formatSize(transferredSize)}&nbsp;/&nbsp;</> : <></>
                    }
                    {MetricHelper.formatSize(file.size)}
                </div>
            }

            action={
                <div className={Styles.Percentage}>
                    {
                        transferredSize != 0 ? MetricHelper.percent(transferredSize, file.size) : <></>
                    }
                </div>
            }
            className={Styles.Person}
        />
    )
}
