import {Button} from './Button';
import React from 'react';

import Styles from './FileDragNDrop.module.scss';

import icon from 'renderer/assets/images/DragNDrop.png';

export function FileDragNDrop(props) {
    return (
        <div className={Styles.FileDragNDrop}>
            <img className={Styles.Logo} src={icon} alt=""/>
            <div className={Styles.Label}>
                <div className={Styles.LabelTop}>
                    Let's send some files
                </div>
                <div className={Styles.LabelBottom}>
                    Pick up a file or use a drag-n-drop
                </div>
            </div>
            <Button>Choose</Button>
        </div>
    )
}
