import React from "react"
import Styles from "./FilePerson.module.scss";

import BaseHelper from "renderer/helpers/BaseHelper";
import {Person} from "renderer/components/pages/main/person/common/Person";

interface Props {
    name: string,
    avatar: string | React.ReactNode,
    size: number,
    filesCount: number,
    percent: number,
}

export function FilePerson({name, avatar, size, filesCount, percent}: Props) {
    return (
        <Person
            name={name}
            avatar={avatar}
            hint={
                <div className={Styles.Hint}>
                    <span className={Styles.HintFiles}>
                        {size} Mb
                    </span>
                    &nbsp;&nbsp;
                    {filesCount} files
                </div>
            }
            action={
                <>
                    <div className={Styles.Percent}>
                        {percent}
                    </div>
                </>
            }
            className={Styles.Person}
        />
    )
}
