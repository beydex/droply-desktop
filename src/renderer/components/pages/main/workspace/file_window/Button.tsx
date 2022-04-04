import React from 'react';
import Styles from './Button.module.scss';

import BaseHelper from 'renderer/helpers/BaseHelper';

interface Props {
    className?: string
    children?: React.ReactNode,

    onClick?: () => void
}

export function Button({children, className, onClick}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Button, className)}
             onClick={() => onClick?.()}>
            {children}
        </div>
    );
}
