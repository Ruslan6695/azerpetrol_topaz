import { memo } from 'react'
import FuelSvg from '../assets/fuel.svg'
import FuelGreenSvg from '../assets/fuel_green.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
    green?: boolean
}

export const FuelIcon = memo(({ size, green }: Props) => {
    if (green) {
        return (
            <FuelGreenSvg
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
