import React, { useState } from 'react'
import BaseHelper from 'renderer/helpers/BaseHelper';
import Styles from './CodeInput.module.scss'

export function CodeInput() {
    let defaultValue = 'Enter code';
    let [text, setText] = useState<string>(defaultValue);
    let [inputClass, setInputClass] = useState<string>(Styles.InactiveInput);

    return (
        <input className={BaseHelper.classes(Styles.Input, inputClass)} 
            type="text" 
            value={text}
            onFocus={(event) => {
                if (text === defaultValue) {
                    setInputClass(Styles.ActiveInput);
                    setText('');
                }
            }}
            onChange={(event) => {
                setText(event.target.value);
            }}
            onBlur={(event) => {
                if (text.trim() === '') {
                    setInputClass(Styles.InactiveInput);
                    setText(defaultValue);
                }
            }}
        />
    )
}