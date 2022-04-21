import React from "react";
import Styles from "./TransferPerson.module.scss";

import {Person} from "renderer/components/pages/main/person/common/Person";
import BaseHelper from "renderer/helpers/BaseHelper";
import {Transfer} from "renderer/repository/TransferRepository";

interface Props {
    transfer: Transfer
}

export function TransferPerson({transfer}: Props) {
    let user = transfer.outgoing ? transfer.receiver : transfer.sender

    return (
        <Person
            name={user.name}
            avatar={user.avatarUrl}

            hint={
                <div className={Styles.Hint}>
                    <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                        {transfer.outgoing ? "north" : "south"}
                    </span>

                    &nbsp;{transfer.outgoing ? "Sending" : "Receiving"}&nbsp;
                    <span className={Styles.HintFiles}>
                        {transfer.files.length} files
                    </span>
                </div>
            }

            className={Styles.Person}
        />
    )
}
