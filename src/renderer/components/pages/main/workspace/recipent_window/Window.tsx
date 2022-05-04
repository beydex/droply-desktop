import React from 'react'
import Styles from './Window.module.scss'
import BaseHelper from "renderer/helpers/BaseHelper";
import {SearchSection} from "renderer/components/pages/main/workspace/recipent_window/SearchSection";
import {HistorySection} from "renderer/components/pages/main/workspace/recipent_window/HistorySection";
import {useNavigate} from "react-router-dom";

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
                    Choose a recipient
                </div>
            </div>
            <div className={Styles.Hint}>
                They will receive a notification
            </div>

            <SearchSection/>
            <HistorySection/>
        </div>
    )
}
