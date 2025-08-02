import { memo } from 'react'
import { StyleSheet } from 'react-native'
import SmsSvg from '../assets/sms.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const SmsIcon = memo(({ size }: Props) => {
    return (
        <SmsSvg
            width={(size || 25) * SIZES.PX}
            height={(size || 25) * SIZES.PX}
        />
    )
})
