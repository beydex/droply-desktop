import React, {useEffect} from 'react';
import Styles from './Window.module.scss';
import {FileRepository} from "renderer/repository/FileRepository";
import {useNavigate} from "react-router-dom";
import {MainPageRouting} from "renderer/components/pages/main/Page";
import {useDropzone} from "react-dropzone";
import {Button} from "renderer/components/pages/main/workspace/file_window/Button";

import FolderImage from "renderer/assets/images/Folder.png"
import BaseHelper from "renderer/helpers/BaseHelper";

export function Window() {
    let navigate = useNavigate();
    let {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: onDragNDrop})

    async function onPaste(event: ClipboardEvent) {
        const clipboardFiles = event.clipboardData.files
        if (clipboardFiles.length <= 0) {
            return
        }

        await onDragNDrop([...clipboardFiles])
    }

    async function onDragNDrop(files: File[]) {
        FileRepository.Instance.setFiles(files)
        navigate(MainPageRouting.Recipient)
    }

    async function onButtonClick() {
        await FileRepository.Instance.requestFiles()
        navigate(MainPageRouting.Recipient)
    }

    useEffect(() => {
        window.addEventListener("paste", onPaste);
        return () => window.removeEventListener("paste", onPaste);
    }, []);

    return (
        <div className={Styles.Window}
             {...getRootProps({onClick: e => e.stopPropagation()})}
        >
            <input {...getInputProps()}/>

            {
                isDragActive ? (
                    <>
                        <div className={Styles.DragArea}>
                            <span className={BaseHelper.classes(Styles.DragIcon, Styles.MaterialIcon)}>
                                cloud_upload
                            </span>

                            <div className={Styles.Label}>
                                <div className={Styles.LabelTop}>
                                    Drop files to send
                                </div>
                                <div className={Styles.LabelBottom}>
                                    You can drop multiple files here
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <img className={Styles.Logo} src={FolderImage} alt="" draggable={false}/>

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
                    </>
                )
            }
        </div>
    )
}
