import { memo } from 'react'
import DisabledSvg from '../assets/disabled.svg'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const DisabledIcon = memo(({ size }: Props) => {
    return (
        <DisabledSvg
            height={size || 22 * SIZES.PX}
            width={size || 22 * SIZES.PX}
        />
    )
})
