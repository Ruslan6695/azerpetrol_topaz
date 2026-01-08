import { memo } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'
import CloseRedSvg from '../assets/close_red.svg'
type Props = {
    red?: boolean
    size?: number
}

export const CloseIcon = memo(({ red, size }: Props) => {
    if (red) {
        return (
            <CloseRedSvg
                height={(size || 24) * SIZES.PX}
                width={(size || 24) * SIZES.PX}
            />
        )
    }
    return (
        <AntDesign
            name="close"
            size={(size || 24) * SIZES.PX}
            color={COLORS.Icon.Secondary}
        />
    )
})
