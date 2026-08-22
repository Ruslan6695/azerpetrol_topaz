import { memo, useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SEGMENT_BG_TRANSITION } from '../../common/config/lib/motion/transitions'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'
import { ITabWithBackground } from '../config/interfaces/ITabWithBackground'

interface IProps extends ITabWithBackground {
    isFirst: boolean
    isLast: boolean
    isSelected: boolean
    onPress: (tab: ITabWithBackground) => void
}

// Сегмент-контрол макета: активный сегмент — лаймовая пилюля с тёмным текстом,
// неактивный — прозрачный. isFirst/isLast больше не нужны (все сегменты — пилюли),
// но остаются в сигнатуре, чтобы не трогать вызывающие места.
export const TabWithBackground = memo(
    ({ label, value, isSelected, onPress }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const styles = useMemo(
            () =>
                StyleSheet.create({
                    container: {
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 10 * SIZES.PX,
                        borderRadius: RADII.PILL,
                        // Лайм с нулевой альфой вместо 'transparent': иначе
                        // перетекание фона идёт через rgba(0,0,0,0) и на
                        // середине даёт тёмный подтон.
                        backgroundColor: isSelected
                            ? COLORS.ACCENT.Lime
                            : COLORS.ACCENT.LimeClear,
                    },
                }),
            [COLORS, isSelected]
        )
        const handlePress = useCallback(() => {
            onPress({ label, value })
        }, [value, label, onPress])

        return (
            <PressableScale
                onPress={handlePress}
                scaleTo={PRESS_SCALE.CHIP}
                // transition: background .2s из макета
                style={[styles.container, SEGMENT_BG_TRANSITION]}
            >
                <Typography
                    type="label13"
                    customColor={
                        isSelected
                            ? COLORS.ACCENT.OnLime
                            : COLORS.TEXT.Secondary
                    }
                >
                    {label}
                </Typography>
            </PressableScale>
        )
    }
)
