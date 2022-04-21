import React from "react";
import Styles from "./TransferPerson.module.scss";

import {Person} from "renderer/components/pages/main/person/common/Person";
import BaseHelper from "renderer/helpers/BaseHelper";
import {Transfer, TransferState} from "renderer/repository/TransferRepository";

interface Props {
    transfer: Transfer
}

export function TransferPerson({transfer}: Props) {
    let request = transfer.request
    let user = request.outgoing ? request.receiver : request.sender

    function renderHint(): React.ReactNode {
        switch (transfer.state) {
            case TransferState.EXCHANGING:
                return (
                    <>
                        <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                            {request.outgoing ? "north" : "south"}
                        </span>
                        &nbsp;RTC exchanging
                    </>
                )

            case TransferState.ACTIVE:
                return (
                    <>
                        <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                            {request.outgoing ? "north" : "south"}
                        </span>
                        &nbsp;{request.outgoing ? "Sending" : "Receiving"}&nbsp;
                        <span className={Styles.HintFiles}>
                            {request.files.length} files
                        </span>
                    </>
                )

            case TransferState.DONE:
                return (
                    <>
                        <span className={BaseHelper.classes(Styles.DoneIcon, Styles.MaterialIcon)}>
                            done
                        </span>
                        &nbsp;{request.outgoing ? "Sent" : "Received"}&nbsp;
                        <span className={Styles.HintFiles}>
                            {request.files.length} file(s)
                        </span>
                    </>
                )
        }
    }

    return (
        <Person
            name={user.name}
            avatar={user.avatarUrl}

            hint={
                <div className={Styles.Hint}>
                    {renderHint()}
                </div>
            }

            className={Styles.Person}
        />
    )
}
