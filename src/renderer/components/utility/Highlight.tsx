import React from 'react';
import Styles from './Highlight.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper';
import {Pointer} from "renderer/components/utility/Pointer";

interface Props {
    children?: React.ReactNode,
}

export function Highlight({children}: Props) {
    return (
        <div className={BaseHelper.classes(Styles.Highlight)}>
            <Pointer>
                {children}
            </Pointer>
        </div>
    );
}
