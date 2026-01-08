import { memo } from 'react'
import LogoFullSvg from '../assets/logo_full.svg'
import LogoFullDarkSvg from '../assets/logo_full_dark.svg'
import { StyleSheet } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { EColorThemes } from '../../common/config/enums/EColorThemes'

type Props = {
    width?: number
    height?: number
}

export const LogoFull = memo(({ width, height }: Props) => {
    const colorTheme = ThemeStore.useTheme()

    if (colorTheme === EColorThemes.DARK) {
        return (
            <LogoFullDarkSvg
                width={(width || 50) * SIZES.PX}
                height={(height || 50) * SIZES.PX}
            />
        )
    }
    return (
        <LogoFullSvg
            width={(width || 50) * SIZES.PX}
            height={(height || 50) * SIZES.PX}
        />
    )
})
