import React from "react";
import Styles from "./TransferPerson.module.scss";

import {Person} from "renderer/components/pages/main/person/common/Person";
import BaseHelper from "renderer/helpers/BaseHelper";

interface Props {
    name: string
    avatar: string

    filesCount: number
}

export function TransferPerson({name, avatar, filesCount}: Props) {
    return (
        <Person
            name={name}
            avatar={avatar}

            hint={
                <div className={Styles.Hint}>
                    <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                        south
                    </span>

                    &nbsp;Receiving&nbsp;
                    <span className={Styles.HintFiles}>
                        {filesCount} files
                    </span>
                </div>
            }/>
    )
}
