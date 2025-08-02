import { memo } from 'react'
import PhoneSvg from '../assets/phone.svg'
import { SIZES } from '../../common/config/constants/sizes'
import { StyleSheet } from 'react-native'
type Props = {
    size?: number
}

export const PhoneIcon = memo(({ size }: Props) => {
    return (
        <PhoneSvg
            width={(size || 25) * SIZES.PX}
            height={(size || 25) * SIZES.PX}
        />
    )
})
