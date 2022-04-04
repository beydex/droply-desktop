import React from 'react'
import {Section} from './common/Section'

import {Loading} from "renderer/components/pages/main/workspace/recipent_window/common/Loading";

export function LocalSection() {
    return (
        <Section title="Local network">
            <Loading text="Searching for accounts in local network..."/>
        </Section>
    )
}
