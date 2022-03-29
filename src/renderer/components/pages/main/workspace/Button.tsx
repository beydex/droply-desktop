import React from 'react';
import Styles from './Button.module.scss';

import BaseHelper from 'renderer/helpers/BaseHelper';

interface Props {
    children?: React.ReactNode,
    className?: string
}

export function Button({children, className}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Button, className)}>
            {children}
        </div>
    );
}
