import React, {useState} from 'react'
import Styles from './CodeInput.module.scss'

function getCode(code: string): string {
    return code.replace(/[ -]/g, "")
}

function formatCode(code: string): string {
    let parts = code.match(/.{1,3}/g)
    if (parts == null) {
        return ""
    }

    return parts.join("-")
}

interface Props {
    onCode?: (code: number) => void;
}

export function CodeInput({onCode}: Props) {
    let [text, setText] = useState<string>("");

    return (
        <input className={Styles.Input}
               placeholder="Enter code"
               value={text}
               onChange={(event) => {
                   let code = getCode(event.target.value)
                   if (code.length == 9 && /^\d+$/.test(code)) {
                       onCode?.(parseInt(code))
                   }

                   setText(formatCode(code));
               }}
        />
    )
}
