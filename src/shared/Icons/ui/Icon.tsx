import { memo } from 'react'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { ICONS } from '../config/constants/ICONS'
import { TIconName } from '../config/types/TIconName'

type Props = {
    name: TIconName
    size?: number
    color?: string
    opacity?: number
}

// Иконки набора «21 Век» нормализованы на currentColor, поэтому
// react-native-svg красит все штрихи и заливки из пропа color корневого <Svg>.
export const Icon = memo(({ name, size = 24, color, opacity }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const Svg = ICONS[name]

    return (
        <Svg
            width={size * SIZES.PX}
            height={size * SIZES.PX}
            color={color ?? COLORS.TEXT.Primary}
            opacity={opacity}
        />
    )
})
