import {Card} from './Card';
import BaseHelper from 'renderer/helpers/BaseHelper';
import React from 'react';
import Styles from './DeviseCode.module.scss';
import PageStyles from '../Page.module.scss';
import {Pointer} from "renderer/components/utility/Pointer";

export function DeviseCode(props) {
    return (
        <Card name="Your Code">
            <div className={PageStyles.Description}>
                Copy and share it with whoever you want to exchange files with
            </div>

            <div className={Styles.DeviseCode}>
                <Pointer>
                    <div className={Styles.Code}>
                        <span className={BaseHelper.classes(Styles.MaterialIcon, Styles.CopyIcon)}>
                            copy_all
                        </span>

                        012-788-235
                    </div>
                </Pointer>
            </div>
        </Card>
    )
}
