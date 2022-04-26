import React from 'react';
import Styles from './CancelButton.module.scss';

import BaseHelper from 'renderer/helpers/BaseHelper';

interface Props {
    className?: string
    children?: React.ReactNode,

    onClick?: () => void
}

export function CancelButton({children, className, onClick}: Props) {
    return (
        <div className={Styles.Container}>
            <div className={BaseHelper.classes(Styles.Button, className)}
                onClick={() => onClick?.()}>
                Cancel
            </div>
        </div>
    );
}
