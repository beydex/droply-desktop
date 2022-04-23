import React from "react"
import Styles from "./RequestPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";
import {Request} from "renderer/repository/RequestRepository";

interface Props {
    request: Request
}

export function RequestPerson({request}: Props) {
    async function onAccept() {
        await request.answer(true)
    }

    async function onCancel() {
        if (request.outgoing) {
            await request.cancel()
        } else {
            await request.answer(false)
        }
    }

    return (
        <Person
            name={request.user.name}
            avatar={request.user.avatarUrl}

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
                        request.outgoing ? (
                            <></>
                        ) : (
                            <span className={BaseHelper.classes(Styles.AcceptIcon, Styles.MaterialIcon)}
                                  onClick={onAccept}>
                                done
                            </span>
                        )
                    }

                    <span className={BaseHelper.classes(Styles.RejectIcon, Styles.MaterialIcon)}
                          onClick={onCancel}>
                        close
                    </span>
                </>
            }

            className={Styles.Person}
        />
    )
}
