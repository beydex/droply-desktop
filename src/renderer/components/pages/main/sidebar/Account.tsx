import {Card} from './Card';
import {Person} from '../Person';
import React from 'react';

import Styles from './Account.module.scss';

import Avatar1 from 'renderer/assets/images/Avatar1.png';
import BaseHelper from 'renderer/helpers/BaseHelper';
import {User} from 'renderer/repository/UserRepository';
import {Pointer} from "renderer/components/utility/Pointer";

interface Props {
    user: User,
}

export function Account({user}: Props) {
    return (
        <Card name='Account'>
            <Person
                avatar={user.avatarUrl == null ? Avatar1 : user.avatarUrl}
                name={user.name}
                subscript={user.email}>

                <Pointer>
                <span className={BaseHelper.classes(Styles.MaterialIcon, Styles.Icon)}>
                    change_circle
                </span>
                </Pointer>
            </Person>
        </Card>
    )
}
