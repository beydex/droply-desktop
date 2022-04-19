import {Button} from './Button';
import React from 'react';
import Styles from './Window.module.scss';

import icon from 'renderer/assets/images/DragNDrop.png';
import {FileRepository} from "renderer/repository/FileRepository";
import {useNavigate} from "react-router-dom";
import {MainPageRouting} from "renderer/components/pages/main/Page";

export function Window() {
    let navigate = useNavigate();

    async function onButtonClick() {
        await FileRepository.Instance.requestFiles()

        navigate(MainPageRouting.Recipient)
    }

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

            <Button onClick={onButtonClick}>
                Choose
            </Button>
        </div>
    )
}
