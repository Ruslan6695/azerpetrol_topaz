import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'

type Props = {
    value: boolean
    /** Не обязателен: в макете тапается вся строка, а не сам свитч */
    onValueChange?: () => void
    disabled?: boolean
}

const TRACK_WIDTH = 48
const TRACK_HEIGHT = 28
const KNOB_SIZE = 22
const KNOB_OFFSET = 3
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - KNOB_OFFSET * 2

// Свитч из макета: трек 48×28, ручка 22 едет 3 → 23 с пружинной кривой.
export const Switch = memo(({ value, onValueChange, disabled }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    // Одна общая прогрессия на сдвиг ручки и цвет трека, чтобы они не разъезжались.
    const progress = useDerivedValue(
        () =>
            withTiming(value ? 1 : 0, {
                duration: 250,
                easing: Easing.bezier(0.3, 1.4, 0.5, 1),
            }),
        [value]
    )

    const trackStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [COLORS.STATE.SwitchTrackOff, COLORS.ACCENT.Primary]
        ),
    }))

    const knobStyle = useAnimatedStyle(() => ({
        left: (KNOB_OFFSET + progress.value * KNOB_TRAVEL) * SIZES.PX,
    }))

    const styles = useMemo(
        () =>
            StyleSheet.create({
                track: {
                    width: TRACK_WIDTH * SIZES.PX,
                    height: TRACK_HEIGHT * SIZES.PX,
                    borderRadius: RADII.PILL,
                    justifyContent: 'center',
                    opacity: disabled ? 0.5 : 1,
                },
                knob: {
                    position: 'absolute',
                    width: KNOB_SIZE * SIZES.PX,
                    height: KNOB_SIZE * SIZES.PX,
                    borderRadius: RADII.PILL,
                    backgroundColor: COLORS.STATE.SwitchKnob,
                },
            }),
        [COLORS, disabled]
    )

    const track = (
        <Animated.View style={[styles.track, trackStyle]}>
            <Animated.View style={[styles.knob, knobStyle]} />
        </Animated.View>
    )

    if (!onValueChange) {
        return <View>{track}</View>
    }

    return (
        <PressableScale
            onPress={onValueChange}
            disabled={disabled}
            scaleTo={PRESS_SCALE.CHIP}
        >
            {track}
        </PressableScale>
    )
})
