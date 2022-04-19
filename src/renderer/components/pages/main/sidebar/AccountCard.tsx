import {Card} from './common/Card';
import {Person} from '../person/common/Person';
import React, {useEffect, useState} from 'react';

import Styles from './AccountCard.module.scss';

import BaseHelper from 'renderer/helpers/BaseHelper';
import {User, UserRepository} from 'renderer/repository/UserRepository';
import {Prompt} from "renderer/components/pages/main/Prompt";
import {AuthRepository} from "renderer/repository/AuthRepository";
import {useNavigate} from "react-router-dom";
import {AppRoting} from "renderer/components/App";

interface Props {
    onChangeAccount?: () => void
}

export function AccountCard(props: Props) {
    let navigate = useNavigate()

    let [logoutPrompt, setLogoutPrompt] = useState<boolean>(false)

    let [user, setUser] = useState<User>({
        urid: 0,
        name: "",
        email: "",
        avatarUrl: null
    });

    useEffect(() => {
        getUser().then()
    }, [])

    async function getUser() {
        let user = await UserRepository.Instance.getUser();

        if (user != null) {
            setUser(user)
        }
    }

    async function logout() {
        await AuthRepository.Instance.logout()

        navigate(AppRoting.Auth)
    }

    return (
        <Card name='Account'>
            <Prompt show={logoutPrompt}
                    text="Logout?"
                    onContinue={logout}
                    onCancel={() => setLogoutPrompt(false)}/>

            <Person
                name={user.name}
                avatar={user.avatarUrl}

                hint={
                    <div className={BaseHelper.classes(Styles.Hint, Styles.Ellipsis)}>
                        {user.email}
                    </div>
                }
                action={
                    <span className={BaseHelper.classes(Styles.MaterialIcon, Styles.ChangeIcon)}
                          onClick={() => setLogoutPrompt(true)}>
                        change_circle
                    </span>
                }/>
        </Card>
    )
}
