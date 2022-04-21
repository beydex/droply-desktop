import React from "react"
import Styles from "./RequestPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {Request} from "renderer/repository/RequestRepository";

interface Props {
    request: Request

    onAccept?: (transfer: Request) => void
    onCancel?: (transfer: Request) => void
}

export function RequestPerson({request, onAccept, onCancel}: Props) {
    let user = request.outgoing ? request.receiver : request.sender

    return (
        <Person
            name={user.name}
            avatar={user.avatarUrl}

            hint={
                <div className={BaseHelper.classes(Styles.Hint, Styles.Ellipsis)}>
                    <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                        {request.outgoing ? "north" : "south"}
                    </span>

                    &nbsp;{request.outgoing ? "Sending" : "Receiving"}&nbsp;
                    <span className={Styles.HintFiles}>
                        {request.files.length} file(s)
                    </span>
                </div>
            }

            action={
                <>
                    {
                        request.outgoing
                            ? <></>
                            : (
                                <span className={BaseHelper.classes(Styles.AcceptIcon, Styles.MaterialIcon)}
                                      onClick={() => onAccept?.(request)}>
                                    done
                                </span>
                            )
                    }

                    <span className={BaseHelper.classes(Styles.RejectIcon, Styles.MaterialIcon)}
                          onClick={() => onCancel?.(request)}>
                        close
                    </span>
                </>
            }

            className={Styles.Person}
        />
    )
}
