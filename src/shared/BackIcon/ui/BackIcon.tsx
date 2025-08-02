import { memo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'

type Props = {
    size?: number
}

export const BackIcon = memo(({ size }: Props) => {
    return (
        <Ionicons
            name="chevron-back"
            size={(size || 30) * SIZES.PX}
            color={COLORS.GRAY}
        />
    )
})
