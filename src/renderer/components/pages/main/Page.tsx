import React, {useEffect, useRef} from 'react';
import Styles from './Page.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper';
import {AccountCard} from './sidebar/AccountCard';
import {CodeCard} from './sidebar/CodeCard';
import {RequestsCard} from './sidebar/RequestsCard';
import {TransfersCard} from './sidebar/TransfersCard';
import {Logo} from "renderer/components/Logo";

import {Window as FileWindow} from "renderer/components/pages/main/workspace/file_window/Window";
import {Window as RecipientWindow} from "renderer/components/pages/main/workspace/recipent_window/Window";
import {Window as TransferWindow} from "renderer/components/pages/main/workspace/transfer_window/Window";

import {Route, Routes} from "react-router-dom";
import gsap from "gsap";

const ANIMATION_DELAY = 1000

export class MainPageRouting {
    public static Recipient = "recipient"
    public static Transfer = "transfer"
}

export function Page() {
    let logoRef = useRef();
    let contentRef = useRef();

    useEffect(() => {
        setTimeout(runAnimation, ANIMATION_DELAY)
    }, [])

    function runAnimation() {
        let timeline = gsap.timeline()

        timeline.to(logoRef.current, {
            opacity: 0,
            scale: 0.5,

            ease: "expo.out",
            duration: 0.3,
        }, "logo")

        timeline.to(contentRef.current, {
            opacity: 1,
            transform: "scale(1)",

            ease: "expo.out",
            duration: 0.3,
        }, "logo+=0.2")
    }

    return (
        <div className={Styles.Page}>
            <div ref={logoRef} className={Styles.Logo}>
                <Logo/>
            </div>

            <div ref={contentRef} className={Styles.Container}>
                <div className={BaseHelper.classes(Styles.Sidebar)}>
                    <AccountCard/>
                    <CodeCard/>

                    <RequestsCard/>
                    <TransfersCard/>
                </div>


                <div className={BaseHelper.classes(Styles.Workspace)}>
                    <Routes>
                        <Route index element={<FileWindow/>}/>
                        <Route path={MainPageRouting.Recipient} element={<RecipientWindow/>}/>
                        <Route path={MainPageRouting.Transfer} element={<TransferWindow/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}

/*
<div className={BaseHelper.classes(Styles.Workspace)}>
                    <Window/>
                </div>
*/
