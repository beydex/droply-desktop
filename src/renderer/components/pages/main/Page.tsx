import React, {useEffect, useRef} from 'react';
import Styles from './Page.module.scss'

import BaseHelper from 'renderer/helpers/BaseHelper';
import {AccountCard} from './sidebar/AccountCard';
import {CodeCard} from './sidebar/CodeCard';
import {RequestsCard} from './sidebar/RequestsCard';
import {TransfersCard} from './sidebar/TransfersCard';
import {Logo} from "renderer/components/Logo";

import {VersionText} from './VersionText';

import {Window as FileWindow} from "renderer/components/pages/main/workspace/file_window/Window";
import {Window as RecipientWindow} from "renderer/components/pages/main/workspace/recipent_window/Window";
import {Window as RequestWindow} from "renderer/components/pages/main/workspace/request_window/Window";

import {Route, Routes} from "react-router-dom";
import gsap from "gsap";
import { ScrolledList } from './ScrolledList';
import { RequestChange, RequestRepository, RequestRepositoryEvent, RequestState } from 'renderer/repository/RequestRepository';
import { Request as RepoRequest } from 'renderer/repository/RequestRepository';

const ANIMATION_DELAY = 1000

function makeNotification(request: RepoRequest, change: RequestChange) {
    if (!document.hasFocus()) {
        return;
    }
    let notification;
    switch (change) {
        case RequestChange.ADDED:
            if (!request.outgoing) {
                notification = new Notification(`New request from ${request.user.name} that contains ${request.files.length} file(s)`);
            }
            break;
        case RequestChange.ACCEPTED:
            if (request.outgoing) {
                notification = new Notification(`${request.user.name} accepted your request`);
            }
            break;
        case RequestChange.DELETED:
            if (request.outgoing) {
                if (request.state = RequestState.ACTIVE) {
                    notification = new Notification(`${request.user.name} cancelled your transfer`);
                } else {
                    notification = new Notification(`${request.user.name} rejected your request`);
                }
            }
            break;
        case RequestChange.ENDED:
            notification = new Notification(`Transaction successfuly ended`);
            break;
    }
}

export class MainPageRouting {
    public static Recipient = "recipient"
    public static Request = "request"
}

export function Page() {
    let logoRef = useRef();
    let contentRef = useRef();

    useEffect(() => {
        setTimeout(runAnimation, ANIMATION_DELAY)
    }, [])

    useEffect(() => {
        RequestRepository.Instance.on(RequestRepositoryEvent.NOTIFICATION, makeNotification);
        return function() {
            RequestRepository.Instance.off(RequestRepositoryEvent.NOTIFICATION, makeNotification);     
        }
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
                    <ScrolledList maxHeight={90}>
                        <AccountCard/>
                        <CodeCard/>

                        <RequestsCard/>
                        <TransfersCard/>
                    </ScrolledList>
                </div>


                <div className={BaseHelper.classes(Styles.Workspace)}>
                    <Routes>
                        <Route index element={<FileWindow/>}/>
                        <Route path={MainPageRouting.Recipient} element={<RecipientWindow/>}/>
                        <Route path={MainPageRouting.Request} element={<RequestWindow/>}/>
                    </Routes>
                </div>

                <VersionText/>
            </div>
        </div>
    )
}
