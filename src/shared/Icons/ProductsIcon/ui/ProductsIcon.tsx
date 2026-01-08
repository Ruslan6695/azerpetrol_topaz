import { memo } from 'react'
import ProductsSvg from '../assets/products.svg'
import ProductsInvertSvg from '../assets/products_invert.svg'
import { SIZES } from '../../../common/config/constants/sizes'
import { ThemeStore } from '../../../common/model/themeStore'
import { EColorThemes } from '../../../common/config/enums/EColorThemes'
type Props = {
    size?: number
}

export const ProductsIcon = memo(({ size }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    if (colorTheme === EColorThemes.DARK) {
        return (
            <ProductsInvertSvg
                width={(size || 22) * SIZES.PX}
                height={(size || 22) * SIZES.PX}
            />
        )
    }
    return (
        <ProductsSvg
            width={(size || 22) * SIZES.PX}
            height={(size || 22) * SIZES.PX}
        />
    )
})
