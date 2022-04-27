import BaseHelper from 'renderer/helpers/BaseHelper';
import React from 'react';
import Styles from './VersionText.module.scss';

export function VersionText() {
    return (
        <p className={BaseHelper.classes(Styles.Mute)}>Build v{process.env.DROPLY_VERSION}</p>
    )
}
