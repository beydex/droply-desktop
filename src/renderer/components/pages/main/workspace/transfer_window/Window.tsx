import React from 'react'
import Styles from './Window.module.scss'
import {useNavigate} from "react-router-dom";
import BaseHelper from 'renderer/helpers/BaseHelper';
import { FilesSection } from './FilesSection';
import { UserSection } from './UserSection';
import { CancelButton } from './CancelButton';

export function Window() {
    let navigate = useNavigate();

    function onArrowClick() {
        navigate("../")
    }

    return (
        <div className={Styles.Window}>
            <div className={Styles.Title}>
                <span className={BaseHelper.classes(Styles.ArrowIcon, Styles.MaterialIcon)}
                      onClick={onArrowClick}>
                    arrow_back
                </span>
                <div className={Styles.TitleText}>
                Active transfer
                </div>
            </div>
            <div className={Styles.Hint}>
                Detailed info about active file transfer
            </div>

            <UserSection/>
            <FilesSection/>
            <CancelButton/>
        </div>
    )
}
