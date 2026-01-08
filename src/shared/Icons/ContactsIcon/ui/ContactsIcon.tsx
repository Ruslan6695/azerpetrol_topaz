import React from 'react'
import ContactsSvg from '../assets/contacts.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const ContactsIcon = ({ size }: Props) => {
    return (
        <ContactsSvg
            width={(size || 24) * SIZES.PX}
            height={(size || 24) * SIZES.PX}
        />
    )
}
