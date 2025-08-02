import { memo } from 'react'
import { StyleSheet } from 'react-native'
import PersonSvg from '../assets/person.svg'
import PersonWhiteSvg from '../assets/personWhite.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
    white?: boolean
    width?: number
}

export const PersonIcon = memo(({ size, white, width }: Props) => {
    if (white) {
        return (
            <PersonWhiteSvg
                width={(width || size || 25) * SIZES.PX}
                height={(size || 25) * SIZES.PX}
            />
        )
    }
    return (
        <PersonSvg
            width={(size || 25) * SIZES.PX}
            height={(size || 25) * SIZES.PX}
        />
    )
})
