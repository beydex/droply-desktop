import {Card} from './Card';
import {Person} from '../Person';
import React from 'react';

import PageStyles from '../Page.module.scss';
import Styles from './Transfers.module.scss';

import icon from 'renderer/assets/images/Avatar3.png';
import BaseHelper from 'renderer/helpers/BaseHelper';
import {Highlight} from "renderer/components/utility/Highlight";
import {Pointer} from "renderer/components/utility/Pointer";

export function Transfers(props) {
    return (
        <Card name="Active transfers">
            <div className={PageStyles.Description}>
                Real-time uploads and downloads
            </div>

            <Person
                avatar={icon}
                name='Joshua Marment' subscript={
                <div className={Styles.Subscript}>
                    <Pointer>
                        <span className={BaseHelper.classes(Styles.MaterialIcon, Styles.Arrow)}>
                            south
                        </span>
                    </Pointer>
                    &nbsp; Receiving&nbsp;
                    <Highlight> 5 files</Highlight>
                </div>
            }/>
        </Card>
    )
}
