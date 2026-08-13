import { memo } from 'react'
import { PROFILE_LINK_ITEMS } from '../config/constants/PROFILE_LINK_ITEMS'
import { ProfileLinkRow } from './ProfileLinkRow'

export const MapProfileLinkItems = memo(() => {
    return (
        <>
            {PROFILE_LINK_ITEMS.map((item, index) => (
                <ProfileLinkRow
                    key={item.link}
                    {...item}
                    last={index === PROFILE_LINK_ITEMS.length - 1}
                />
            ))}
        </>
    )
})
