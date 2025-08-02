import { memo } from 'react'
import PlusSvg from '../assets/plus.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const PlusIcon = memo(({ size }: Props) => {
    return (
        <PlusSvg
            width={(size || 20) * SIZES.PX}
            height={(size || 20) * SIZES.PX}
        />
    )
})
