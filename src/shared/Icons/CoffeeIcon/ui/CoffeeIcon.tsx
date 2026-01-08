import { memo } from 'react'
import CoffeSvg from '../assets/coffee.svg'
import CoffeeInvertSvg from '../assets/coffee_invert.svg'
import { SIZES } from '../../../common/config/constants/sizes'
import { ThemeStore } from '../../../common/model/themeStore'
import { EColorThemes } from '../../../common/config/enums/EColorThemes'
type Props = {
    size?: number
    width?: number
}

export const CoffeeIcon = memo(({ size, width }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    if (colorTheme === EColorThemes.DARK) {
        return (
            <CoffeeInvertSvg
                width={(size || 22) * SIZES.PX}
                height={(size || 22) * SIZES.PX}
            />
        )
    }
    return (
        <CoffeSvg
            width={(size || 22) * SIZES.PX}
            height={(size || 22) * SIZES.PX}
        />
    )
})
