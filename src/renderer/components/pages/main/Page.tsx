import React, {useState} from 'react';
import Styles from './Page.module.scss'

import {Account} from './sidebar/Account';
import {DeviseCode} from './sidebar/DeviseCode';
import {FileDragNDrop} from './workspace/FileDragNDrop';
import {Requests} from './sidebar/Requests';
import {Transfers} from './sidebar/Transfers';
import BaseHelper from 'renderer/helpers/BaseHelper';
import {User, UserRepository} from 'renderer/repository/UserRepository';

export function Page() {
    let [getUser, setUser] = useState<User>({
        name: "",
        email: "",
        avatarUrl: null
    });

    UserRepository.Instance.getUser().then((user) => {
        setUser(user);
    });

    return (
        <div className={BaseHelper.classes(Styles.Page, Styles.Container)}>
            <div className={BaseHelper.classes(Styles.Workspace)}>
                <Account user={getUser}/>
                <DeviseCode/>
                <Requests/>
                <Transfers/>
            </div>

            <div className={BaseHelper.classes(Styles.Sidebar)}>
                <FileDragNDrop/>
            </div>
        </div>
    )
}
