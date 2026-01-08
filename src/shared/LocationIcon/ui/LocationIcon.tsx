import { memo } from 'react'
import { DEFAULT_ICON_SIZE } from '../../common/config/constants/DEFAULT_ICON_SIZE'
import { SIZES } from '../../common/config/constants/sizes'
import { EColorThemes } from '../../common/config/enums/EColorThemes'
import { ThemeStore } from '../../common/model/themeStore'
import LocationSvg from '../assets/location.svg'
import LocationInvertSvg from '../assets/location_invert.svg'
type Props = {
    white?: boolean
    size?: number
}

export const LocationIcon = memo(({ white, size }: Props) => {
    const colorTheme = ThemeStore.useTheme()

    if (white || colorTheme === EColorThemes.DARK) {
        return (
            <LocationInvertSvg
                width={(size || DEFAULT_ICON_SIZE) * SIZES.PX}
                height={(size || DEFAULT_ICON_SIZE) * SIZES.PX}
            />
        )
    }
    return (
        <LocationSvg
            width={(size || DEFAULT_ICON_SIZE) * SIZES.PX}
            height={(size || DEFAULT_ICON_SIZE) * SIZES.PX}
        />
    )
})
