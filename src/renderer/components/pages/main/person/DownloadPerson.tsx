import React from "react"
import Styles from "./DownloadPerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";

interface Props {
    name: string,
    avatar: string,
    speed: number,
    time: number,
}

export function DownloadPerson({name, avatar, speed, time}: Props) {
    return (
        <Person
            name={name}
            avatar={avatar}
            hint={
                <div className={BaseHelper.classes(Styles.Hint, Styles.Ellipsis)}>
                    Speed:&nbsp;
                    <span className={Styles.HintFiles}>
                        <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                            south
                        </span>
                        {speed} Mb/S
                    </span>
                    &nbsp;Time:&nbsp;
                    <span className={Styles.HintFiles}>
                        <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}>
                            schedule
                        </span>
                        &nbsp;{time}s
                    </span>
                </div>
            }
            className={Styles.Person}
        />
    )
}
