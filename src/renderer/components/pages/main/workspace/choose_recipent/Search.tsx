import React from 'react'
import { SearchPerson } from '../../person/SearchPerson'
import { Subsection } from './Section'
import selected_image from 'renderer/assets/images/Avatar2.png'

export function Search() {
    return (
        <>
        <Subsection title="Search results"/>
        <SearchPerson name='Alexey Akhundov' avatar={selected_image} selected={true} />
        </>
    )
}