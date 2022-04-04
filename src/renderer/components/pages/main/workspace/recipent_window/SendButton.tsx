import React from 'react'
import { Button } from '../file_window/Button'
import Styles from './SendButton.module.scss'

export function SendButton() {
    return (
        <div className={Styles.ButtonContainer}>
            <Button>
                Send 
                <div className={Styles.Circle}>
                    1
                </div>
            </Button>
        </div>
    )
}
