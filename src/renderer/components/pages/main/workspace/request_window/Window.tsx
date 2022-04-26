import React, {useEffect, useState} from 'react'
import Styles from './Window.module.scss'
import BaseHelper from 'renderer/helpers/BaseHelper';
import {UserSection} from './UserSection';
import {CancelButton} from './CancelButton';
import {Request, RequestEvent, RequestRepository, RequestRepositoryEvent} from "renderer/repository/RequestRepository";
import {useNavigate} from "react-router-dom";
import {FilesSection} from "renderer/components/pages/main/workspace/request_window/FilesSection";

export function Window() {
    // Exception protection
    let currentRequest = RequestRepository.Instance.getCurrentRequest()
    if (currentRequest == null) {
        return <></>
    }

    let navigate = useNavigate()
    let [request, setRequest] = useState<{ inner: Request }>({inner: currentRequest})

    useEffect(() => {
        RequestRepository.Instance
            .on(RequestRepositoryEvent.CURRENT_REQUEST_UPDATE, updateRequest)

        return function () {
            RequestRepository.Instance
                .off(RequestRepositoryEvent.CURRENT_REQUEST_UPDATE, updateRequest)
        }
    })

    useEffect(() => {
        request.inner.on(RequestEvent.UPDATE, updateRequest)

        return function () {
            request.inner.off(RequestEvent.UPDATE, updateRequest)
        }
    }, [request.inner])

    function updateRequest() {
        setRequest({inner: RequestRepository.Instance.getCurrentRequest()})
    }

    function onArrowClick() {
        navigate("../")
    }

    async function onCancelButtonClick() {
        await request.inner.cancel()
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
                    Request
                </div>
            </div>
            <div className={Styles.Hint}>
                Detailed info about request
            </div>

            <UserSection request={request.inner}/>
            <FilesSection request={request.inner}/>

            <CancelButton onClick={onCancelButtonClick}/>
        </div>
    )
}
