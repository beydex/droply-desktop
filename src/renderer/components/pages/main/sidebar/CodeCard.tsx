import {Card} from './common/Card';
import BaseHelper from 'renderer/helpers/BaseHelper';
import React, {useEffect, useState} from 'react';
import Styles from './CodeCard.module.scss';
import {CodeRepository} from "renderer/repository/CodeRepository";

const ICON_RESET_TIMEOUT = 2000

function formatCode(code: string) {
    return code.match(/.{1,3}/g).join("-")
}

export function CodeCard() {
    let [icon, setIcon] = useState<string>("copy_all")
    let [code, setCode] = useState<string>("000000000");

    useEffect(() => {
        getCode().then()
    }, [])

    async function getCode() {
        let code = await CodeRepository.Instance.getCode()

        setCode(code.toString())
    }

    async function onCodeClick() {
        await navigator.clipboard.writeText(code)

        // Indicating that code has copied to clipboard
        setIcon("done")

        // Resetting icon after timeout
        await BaseHelper.timeout(ICON_RESET_TIMEOUT)
        setIcon("copy_all")
    }

    return (
        <Card
            name="Your Code"
            description="Copy and share it with whoever you want to exchange files with"
        >
            <div className={Styles.Code}
                 onClick={onCodeClick}>
                <span className={BaseHelper.classes(Styles.MaterialIcon, Styles.CopyIcon)}>
                    {icon}
                </span>

                {formatCode(code)}
            </div>
        </Card>
    )
}
