import React from "react";
import Styles from "./TransferPerson.module.scss";

import {Request, RequestState} from "renderer/repository/RequestRepository";

import {Person} from "renderer/components/pages/main/person/common/Person";
import BaseHelper from "renderer/helpers/BaseHelper";

interface Props {
    request: Request
}

export function TransferPerson({request}: Props) {
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
                                cancel
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
                                <span className={Styles.HintFiles}>
                                    {request.files.length} files
                                </span>
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

            className={Styles.Person}
        />
    )
}
