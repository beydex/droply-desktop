import React from 'react';
import Styles from './VersionText.module.scss';

export function VersionText() {
    return (
        <p className={Styles.Mute}>
            {process.env.DROPLY_VERSION}
        </p>
    )
}
