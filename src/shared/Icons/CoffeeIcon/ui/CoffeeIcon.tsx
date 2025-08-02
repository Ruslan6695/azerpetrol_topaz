import { memo } from 'react'
import CoffeSvg from '../assets/coffee.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
    width?: number
}

export const CoffeeIcon = memo(({ size, width }: Props) => {
    return (
        <CoffeSvg
            width={(width || size || 25) * SIZES.PX}
            height={(size || 25) * SIZES.PX}
        />
    )
})
