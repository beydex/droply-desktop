import React from 'react';
import BaseHelper from 'renderer/helpers/BaseHelper';
import Styles from "./Card.module.scss";

interface Props {
    name: string,
    children?: React.ReactNode,
    className?: string
}

export function Card({name, children, className}: Props) {
    return <div className={BaseHelper.classes(Styles.Card, className)}>
        <div className={Styles.Name}>{name}</div>
        {children}
    </div>;
}
