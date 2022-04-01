import React, {useEffect, useRef} from 'react';
import Styles from './Page.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper';
import {AccountCard} from './sidebar/AccountCard';
import {CodeCard} from './sidebar/CodeCard';
import {FileDragNDrop} from './workspace/drag_and_drop/FileDragNDrop';
import {RequestsCard} from './sidebar/RequestsCard';
import {TransfersCard} from './sidebar/TransfersCard';
import {Logo} from "renderer/components/Logo";
import gsap from "gsap";
import { RecipentWindow } from './workspace/choose_recipent/RecipentWindow';

const ANIMATION_DELAY = 1000

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
                    <RecipentWindow/>
                </div>
            </div>
        </div>
    )
}
/*
<div className={BaseHelper.classes(Styles.Workspace)}>
                    <FileDragNDrop/>
                </div>
*/