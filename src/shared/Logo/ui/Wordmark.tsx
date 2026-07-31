import { memo } from 'react'
import { EColorThemes } from '../../common/config/enums/EColorThemes'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import WordmarkDarkSvg from '../assets/wordmark_dark.svg'
import WordmarkLightSvg from '../assets/wordmark_light.svg'

type Props = {
    height?: number
}

// viewBox макета — 849.942 × 145.
const RATIO = 849.942 / 145

export const Wordmark = memo(({ height = 15 }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    const Svg =
        colorTheme === EColorThemes.DARK ? WordmarkDarkSvg : WordmarkLightSvg

    return (
        <Svg
            height={height * SIZES.PX}
            width={height * RATIO * SIZES.PX}
        />
    )
})
