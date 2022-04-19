import React from "react"
import Styles from "./RequestPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {Transfer} from "renderer/repository/TransferRepository";

interface Props {
    transfer: Transfer

    onAccept?: (transfer: Transfer) => void
    onCancel?: (transfer: Transfer) => void
}

export function RequestPerson({transfer, onAccept, onCancel}: Props) {
    let user = transfer.outgoing ? transfer.receiver : transfer.sender

    return (
        <Person
            name={user.name}
            avatar={user.avatarUrl}

            hint={
                <div className={BaseHelper.classes(Styles.Hint, Styles.Ellipsis)}>
                    <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                        {transfer.outgoing ? "north" : "south"}
                    </span>

                    &nbsp;{transfer.outgoing ? "Sending" : "Wants to send"}&nbsp;
                    <span className={Styles.HintFiles}>
                        {transfer.files.length} file(s)
                    </span>
                </div>
            }

            action={
                <>
                    {
                        transfer.outgoing
                            ? <></>
                            : (
                                <span className={BaseHelper.classes(Styles.AcceptIcon, Styles.MaterialIcon)}
                                      onClick={() => onAccept?.(transfer)}>
                                    done
                                </span>
                            )
                    }

                    <span className={BaseHelper.classes(Styles.RejectIcon, Styles.MaterialIcon)}
                          onClick={() => onCancel?.(transfer)}>
                        close
                    </span>
                </>
            }

            className={Styles.Person}
        />
    )
}
