import { memo } from 'react'
import FuelSvg from '../assets/fuel.svg'
import FuelInvertSvg from '../assets/fuel_invert.svg'
import { SIZES } from '../../../common/config/constants/sizes'
import { ThemeStore } from '../../../common/model/themeStore'
import { EColorThemes } from '../../../common/config/enums/EColorThemes'
type Props = {
    size?: number
}

export const FuelIcon = memo(({ size }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    if (colorTheme === EColorThemes.DARK) {
        return (
            <FuelInvertSvg
                width={(size || 22) * SIZES.PX}
                height={(size || 22) * SIZES.PX}
            />
        )
    }
    return (
        <FuelSvg
            width={(size || 22) * SIZES.PX}
            height={(size || 22) * SIZES.PX}
        />
    )
})
