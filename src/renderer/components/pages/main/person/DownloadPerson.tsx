import React from "react"
import Styles from "./DownloadPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {Request, RequestState} from "renderer/repository/RequestRepository";
import {MetricHelper} from "renderer/helpers/MetricHelper";

interface Props {
    request: Request
}

function formatTime(secs: number) {
    let result = "";

    let hours = Math.floor(secs / 3600)
    if (hours >= 1) {
        result += `${hours}h `
    }

    let minutes = Math.floor((secs - hours * 3600) / 60)
    if (minutes >= 1) {
        result += `${minutes}m `
    }

    let seconds = Math.floor(secs - hours * 3600 - minutes * 60)
    result += `${seconds}s`

    return result
}

export function DownloadPerson({request}: Props) {
    let statistics = request.getStatistics()

    return (
        <Person
            name={request.user.name}
            avatar={request.user.avatarUrl}
            hint={
                <div className={BaseHelper.classes(Styles.Hint, Styles.Ellipsis)}>
                    {
                        request.state == RequestState.CREATED ? (
                            <span className={BaseHelper.classes(Styles.ExchangeIcon, Styles.MaterialIcon)}>
                                schedule
                            </span>
                        ) : request.state == RequestState.EXCHANGING ? (
                            <span className={BaseHelper.classes(Styles.ExchangeIcon, Styles.MaterialIcon)}>
                                swap_horiz
                            </span>
                        ) : request.state == RequestState.ACTIVE ? (
                            <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                                {request.outgoing ? "north" : "south"}
                            </span>
                        ) : request.state == RequestState.DONE ? (
                            <span className={BaseHelper.classes(Styles.DoneIcon, Styles.MaterialIcon)}>
                                done
                            </span>
                        ) : (
                            <span className={BaseHelper.classes(Styles.ErrorIcon, Styles.MaterialIcon)}>
                                close
                            </span>
                        )
                    }

                    {
                        request.state == RequestState.CREATED ? (
                            <>
                                &nbsp;Waiting for answer
                            </>
                        ) : request.state == RequestState.EXCHANGING ? (
                            <>
                                &nbsp;RTC exchanging
                            </>
                        ) : request.state == RequestState.ACTIVE ? (
                            <>
                                <div className={Styles.Speed}>
                                    <div>&nbsp;Speed:&nbsp;</div>
                                    <span className={Styles.HintStat}>
                                        {
                                            statistics != null ? MetricHelper.formatSize(statistics.speed) : 0
                                        }
                                        /s
                                    </span>
                                </div>

                                <div className={Styles.Time}>
                                    <div>Time:&nbsp;</div>
                                    <span className={Styles.HintStat}>
                                        {
                                            statistics != null ? MetricHelper.formatTime(statistics.time) : 0
                                        }
                                    </span>
                                </div>
                            </>
                        ) : request.state == RequestState.DONE ? (
                            <>
                                &nbsp;{request.outgoing ? "Sent" : "Received"}&nbsp;
                            </>
                        ) : (
                            <>
                                &nbsp;Transfer failed
                            </>
                        )
                    }
                </div>
            }
            className={Styles.Person}
        />
    )
}

