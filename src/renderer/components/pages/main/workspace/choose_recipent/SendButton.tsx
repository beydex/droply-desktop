import React from 'react'
import { Button } from '../drag_and_drop/Button'
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
