import React, {useEffect, useState} from "react"
import Styles from "./Prompt.module.scss"
import BaseHelper from "renderer/helpers/BaseHelper";

interface Props {
    show: boolean
    text: string

    onContinue?: () => void
    onCancel?: () => void
}

export function Prompt(props: Props) {
    let [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        setShow(props.show)
    }, [props.show])

    return (
        <div className={BaseHelper.classes(Styles.Prompt, !show ? Styles.Hide : "")}>
            <div className={Styles.Window}>
                <div className={Styles.Title}>
                    {props.text}
                </div>

                <div className={Styles.Buttons}>
                    <div className={BaseHelper.classes(Styles.Continue, Styles.Button)}
                         onClick={() => props.onContinue?.()}>
                        Continue
                    </div>

                    <div className={BaseHelper.classes(Styles.Cancel, Styles.Button)}
                         onClick={() => props.onCancel?.()}>
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    )
}
