import { memo } from 'react'
import ProductsSvg from '../assets/products.svg'
import ProductsGreenSvg from '../assets/products_green.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
    green?: boolean
}

export const ProductsIcon = memo(({ green, size }: Props) => {
    if (green) {
        return (
            <ProductsGreenSvg
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
