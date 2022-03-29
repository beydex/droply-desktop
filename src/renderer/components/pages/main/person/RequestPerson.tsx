import React from "react"
import Styles from "./RequestPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";

interface Props {
    name: string
    avatar: string

    filesCount: number
}

export function RequestPerson({name, avatar, filesCount}: Props) {
    return (
        <Person
            name={name}
            avatar={avatar}

            hint={
                <div className={BaseHelper.classes(Styles.Hint, Styles.Ellipsis)}>
                    Sending&nbsp;
                    <span className={Styles.HintFiles}>
                        {filesCount} files
                    </span>
                </div>
            }

            action={
                <>
                    <span className={BaseHelper.classes(Styles.AcceptIcon, Styles.MaterialIcon)}>
                        done
                    </span>

                    <span className={BaseHelper.classes(Styles.RejectIcon, Styles.MaterialIcon)}>
                        close
                    </span>
                </>
            }/>
    )
}
