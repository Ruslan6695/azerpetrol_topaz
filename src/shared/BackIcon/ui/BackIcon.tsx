import { memo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'

type Props = {
    size?: number
}

export const BackIcon = memo(({ size }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    return (
        <Ionicons
            name="chevron-back"
            size={(size || 30) * SIZES.PX}
            color={COLORS.Icon.Primary}
        />
    )
})
