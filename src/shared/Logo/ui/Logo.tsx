import { memo } from 'react'
import LogoSvg from '../assets/logo.svg'
import { StyleSheet } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const Logo = ({ size }: Props) => {
    return (
        <LogoSvg width={size || 50 * SIZES.PX} height={size || 50 * SIZES.PX} />
    )
}
