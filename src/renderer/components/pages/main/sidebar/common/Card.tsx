import React from 'react';
import Styles from "./Card.module.scss";

interface Props {
    name: string,
    description?: string,

    children?: React.ReactNode,
}

export function Card({name, description, children}: Props) {
    return (
        <div className={Styles.Card}>
            <div className={Styles.Name}>
                {name}
            </div>

            {
                description
                    ? (
                        <div className={Styles.Description}>
                            {description}
                        </div>
                    )
                    : <></>
            }

            {children}
        </div>
    )
}
