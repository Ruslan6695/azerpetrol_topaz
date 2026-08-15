import { memo, useCallback, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS, useSharedValue } from 'react-native-reanimated'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'

type Props = {
    value: number
    onChangeValue: (value: number) => void
    min?: number
    max: number
    step?: number
}

const TRACK_HEIGHT = 6
const THUMB_SIZE = 22

// Горизонтальный слайдер макета (dc.html:544). В RN аналога <input type="range">
// нет, а нативной библиотеки в проекте нет — собран на gesture-handler
// и reanimated, которые уже стоят.
export const Slider = memo(
    ({ value, onChangeValue, min = 0, max, step = 1 }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        // Ширина трека известна только после разметки, поэтому и в JS
        // (для рендера заливки), и в shared value (для жеста в UI-потоке).
        const [width, setWidth] = useState(0)
        const trackWidth = useSharedValue(0)

        const handleLayout = useCallback((e: LayoutChangeEvent) => {
            const next = e.nativeEvent.layout.width
            setWidth(next)
            trackWidth.value = next
        }, [])

        // Квантование шагом и кламп живут в одном месте: и жест, и любое
        // внешнее значение проходят через них.
        const clamp = useCallback(
            (raw: number) => {
                const stepped = Math.round(raw / step) * step
                const bounded = Math.max(min, Math.min(max, stepped))
                // 0.30000000000000004 при шаге 0.5 не нужен никому.
                return Number(bounded.toFixed(2))
            },
            [min, max, step]
        )

        const handleMove = useCallback(
            (ratio: number) => {
                onChangeValue(clamp(min + ratio * (max - min)))
            },
            [clamp, min, max, onChangeValue]
        )

        const gesture = Gesture.Pan()
            .minDistance(0)
            .onBegin((e) => {
                if (trackWidth.value > 0) {
                    runOnJS(handleMove)(
                        Math.max(0, Math.min(1, e.x / trackWidth.value))
                    )
                }
            })
            .onUpdate((e) => {
                if (trackWidth.value > 0) {
                    runOnJS(handleMove)(
                        Math.max(0, Math.min(1, e.x / trackWidth.value))
                    )
                }
            })

        const ratio = max > min ? (value - min) / (max - min) : 0
        const filledWidth = Math.max(0, Math.min(1, ratio)) * width

        const styles = StyleSheet.create({
            // Область касания выше трека: по 6px тонкой полоске попасть трудно.
            container: {
                justifyContent: 'center',
                height: THUMB_SIZE * SIZES.PX,
            },
            // Трек сплошной, а не стеклянный: белая плёнка GLASS.Primary
            // с белой же рамкой в светлой теме сливалась с фоном.
            track: {
                height: TRACK_HEIGHT * SIZES.PX,
                borderRadius: RADII.PILL,
                backgroundColor: COLORS.STATE.SliderTrack,
                overflow: 'hidden',
            },
            filled: {
                height: '100%',
                borderRadius: RADII.PILL,
                backgroundColor: COLORS.STATE.SliderFill,
            },
            thumb: {
                position: 'absolute',
                width: THUMB_SIZE * SIZES.PX,
                height: THUMB_SIZE * SIZES.PX,
                borderRadius: RADII.PILL,
                backgroundColor: COLORS.STATE.SliderFill,
                borderWidth: 2 * SIZES.PX,
                borderColor: COLORS.BACKGROUND.Primary,
                // Лайм на светло-зелёном фоне сам по себе почти не читается —
                // ручку выделяет тень, а не цвет.
                shadowColor: COLORS.EFFECTS.Shadow,
                shadowOpacity: 0.25,
                shadowRadius: 4 * SIZES.PX,
                shadowOffset: { width: 0, height: 2 * SIZES.PX },
                elevation: 3,
            },
        })

        return (
            <GestureDetector gesture={gesture}>
                <View style={styles.container} onLayout={handleLayout}>
                    <View style={styles.track}>
                        <View style={[styles.filled, { width: filledWidth }]} />
                    </View>
                    <View
                        style={[
                            styles.thumb,
                            {
                                left: Math.max(
                                    0,
                                    filledWidth - (THUMB_SIZE / 2) * SIZES.PX
                                ),
                            },
                        ]}
                    />
                </View>
            </GestureDetector>
        )
    }
)
