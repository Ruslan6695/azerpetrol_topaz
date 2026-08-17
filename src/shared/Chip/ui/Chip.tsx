import { ReactNode, memo } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SEGMENT_BG_TRANSITION } from '../../common/config/lib/motion/transitions'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'
import { TChipVariants } from '../config/types/TChipVariants'

type Props = {
    label: string
    selected?: boolean
    onPress?: () => void
    icon?: ReactNode
    variant?: TChipVariants
    size?: 'sm' | 'md'
    style?: StyleProp<ViewStyle>
}

export const Chip = memo(
    ({
        label,
        selected,
        onPress,
        icon,
        variant = 'glass',
        size = 'md',
        style,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        // Выбранный чип в макете — сплошной лайм без рамки.
        const isLime = selected || variant === 'lime'
        // Прозрачный фон берём лаймом с нулевой альфой: чип перетекает в лайм,
        // а переход через rgba(0,0,0,0) дал бы тёмный подтон на середине.
        const backgroundColor = isLime
            ? COLORS.ACCENT.Lime
            : variant === 'outline'
              ? COLORS.ACCENT.LimeClear
              : COLORS.GLASS.Primary
        const textColor = isLime ? COLORS.ACCENT.OnLime : COLORS.TEXT.Primary

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6 * SIZES.PX,
                borderRadius: RADII.PILL,
                backgroundColor,
                borderWidth: isLime ? 0 : 1,
                borderColor: isLime ? undefined : COLORS.GLASS.Border,
                paddingVertical: (size === 'sm' ? 6 : 9) * SIZES.PX,
                paddingHorizontal: (size === 'sm' ? 10 : 16) * SIZES.PX,
            },
        })

        return (
            <PressableScale
                onPress={onPress}
                disabled={!onPress}
                scaleTo={PRESS_SCALE.CHIP}
                style={[styles.container, SEGMENT_BG_TRANSITION, style]}
            >
                {icon}
                <Typography type="label13" customColor={textColor}>
                    {label}
                </Typography>
            </PressableScale>
        )
    }
)
