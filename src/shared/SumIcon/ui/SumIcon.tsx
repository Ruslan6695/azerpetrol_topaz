import { memo } from 'react'
import SumSvg from '../assets/sum.svg'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const SumIcon = memo(({ size }: Props) => {
    return (
        <SumSvg
            width={(size || 25) * SIZES.PX}
            height={(size || 25) * SIZES.PX}
        />
    )
})
