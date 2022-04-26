import React from "react";
import Styles from "./TransferPerson.module.scss";

import {Request, RequestRepository, RequestState} from "renderer/repository/RequestRepository";

import {Person} from "renderer/components/pages/main/person/common/Person";
import BaseHelper from "renderer/helpers/BaseHelper";
import {useNavigate} from "react-router-dom";
import {MainPageRouting} from "renderer/components/pages/main/Page";
import {MetricHelper} from "renderer/helpers/MetricHelper";

interface Props {
    request: Request
}

export function TransferPerson({request}: Props) {
    let navigate = useNavigate()

    async function onClick() {
        RequestRepository.Instance.setCurrentRequest(request.id)
        navigate(MainPageRouting.Request)
    }

    let statistics = request.getStatistics()

    return (
        <Person
            name={request.user.name}
            avatar={request.user.avatarUrl}

            hint={
                <div className={Styles.Hint}>
                    {
                        request.state == RequestState.EXCHANGING ? (
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
                        request.state == RequestState.EXCHANGING ? (
                            <>
                                &nbsp;RTC exchanging
                            </>
                        ) : request.state == RequestState.ACTIVE ? (
                            <>
                                &nbsp;{request.outgoing ? "Sending" : "Receiving"}&nbsp;
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

                    {
                        [RequestState.ACTIVE, RequestState.DONE].includes(request.state) ? (
                            <span className={Styles.HintFiles}>
                                {request.files.length} file(s)
                            </span>
                        ) : (
                            <></>
                        )
                    }

                </div>
            }

            action={
                <>
                    {
                        request.state == RequestState.ACTIVE ? (
                            <div className={Styles.Percentage}>
                                {
                                    statistics != null ? MetricHelper.percent(statistics.transferredSize, statistics.size) : 0
                                }
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </>
            }

            className={Styles.Person}

            onClick={onClick}
        />
    )
}
