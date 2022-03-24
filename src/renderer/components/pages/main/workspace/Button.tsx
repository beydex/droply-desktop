import React from 'react';
import Styles from './Button.module.scss';

import BaseHelper from 'renderer/helpers/BaseHelper';
import {Pointer} from "renderer/components/utility/Pointer";

interface Props {
    children?: React.ReactNode,
    className?: string
}

export function Button({children, className}: Props) {
    return (
        <Pointer>
            <div className={BaseHelper.classes(Styles.SimpleButton, className)}>
                {children}
            </div>
        </Pointer>
    );
}
