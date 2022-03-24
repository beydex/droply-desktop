import {Card} from './Card';
import {Person} from '../Person';
import React from 'react';

import PageStyles from '../Page.module.scss';
import Styles from './Requests.module.scss';

import icon from 'renderer/assets/images/Avatar2.png';
import BaseHelper from 'renderer/helpers/BaseHelper';
import {Highlight} from "renderer/components/utility/Highlight";
import {Pointer} from "renderer/components/utility/Pointer";

export function Requests(props) {
    return (
        <Card name="Requests">
            <div className={PageStyles.Description}>
                People who want to send you some files
            </div>

            <Person
                avatar={icon}
                name='Joshua Marment'
                subscript={
                    <div className={Styles.Subscript}>
                        Wants to send&nbsp;
                        <Highlight>3 files</Highlight>
                    </div>
                }>

                <Pointer>
                    <span className={BaseHelper.classes(Styles.MaterialIcon, Styles.YesIcon)}>
                        done
                    </span>
                </Pointer>

                <Pointer>
                    <span className={BaseHelper.classes(Styles.MaterialIcon, Styles.NoIcon)}>
                        close
                    </span>
                </Pointer>
            </Person>
        </Card>
    )
}
