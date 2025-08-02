import { memo } from 'react'
import LogoFullSvg from '../assets/logo_full.svg'
import { StyleSheet } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    width?: number
    height?: number
}

export const LogoFull = memo(({ width, height }: Props) => {
    return (
        <LogoFullSvg
            width={(width || 50) * SIZES.PX}
            height={(height || 50) * SIZES.PX}
        />
    )
})
