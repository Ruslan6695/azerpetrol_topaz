import { memo, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'

import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { Typography } from '../../Typography'

// Рамка прицела и её уголки — из макета (design/21vek-app.dc.html:483–488).
const FRAME = 220
const CORNER = 44
const CORNER_WIDTH = 4
// Лазер ходит не по всей рамке, а с отступом от уголков: в макете
// анимация идёт от 6% до 92% высоты кадра.
const LASER_INSET = 6
const LASER_DURATION = 1800

type Props = {
    /** Подпись под рамкой. По умолчанию — текст макета */
    hint?: string
}

// Оверлей поверх живого кадра камеры: лаймовая рамка с уголками,
// бегущий лазер и подпись. Лежит в shared/CameraScanner, потому что это
// часть обёртки над expo-camera, а не отдельный элемент экрана.
export const ScannerOverlay = memo(
    ({ hint = 'Наведите камеру на QR-код' }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const progress = useSharedValue(0)

        useEffect(() => {
            progress.value = withRepeat(
                withTiming(1, {
                    duration: LASER_DURATION,
                    easing: Easing.inOut(Easing.ease),
                }),
                -1,
                // reverse: лазер возвращается обратно, а не прыгает наверх
                true
            )
        }, [progress])

        const laserStyle = useAnimatedStyle(() => ({
            transform: [
                {
                    translateY:
                        progress.value * (FRAME - LASER_INSET * 2) * SIZES.PX,
                },
            ],
        }))

        const styles = StyleSheet.create({
            container: {
                ...StyleSheet.absoluteFillObject,
                alignItems: 'center',
                justifyContent: 'center',
            },
            frame: {
                width: FRAME * SIZES.PX,
                height: FRAME * SIZES.PX,
            },
            corner: {
                position: 'absolute',
                width: CORNER * SIZES.PX,
                height: CORNER * SIZES.PX,
                borderColor: COLORS.ACCENT.Lime,
            },
            // У каждого уголка скруглён только внешний угол — в макете это
            // одно свойство border-radius на нужной стороне.
            topLeft: {
                top: 0,
                left: 0,
                borderTopWidth: CORNER_WIDTH * SIZES.PX,
                borderLeftWidth: CORNER_WIDTH * SIZES.PX,
                borderTopLeftRadius: RADII.CHIP_SM * SIZES.PX,
            },
            topRight: {
                top: 0,
                right: 0,
                borderTopWidth: CORNER_WIDTH * SIZES.PX,
                borderRightWidth: CORNER_WIDTH * SIZES.PX,
                borderTopRightRadius: RADII.CHIP_SM * SIZES.PX,
            },
            bottomLeft: {
                bottom: 0,
                left: 0,
                borderBottomWidth: CORNER_WIDTH * SIZES.PX,
                borderLeftWidth: CORNER_WIDTH * SIZES.PX,
                borderBottomLeftRadius: RADII.CHIP_SM * SIZES.PX,
            },
            bottomRight: {
                bottom: 0,
                right: 0,
                borderBottomWidth: CORNER_WIDTH * SIZES.PX,
                borderRightWidth: CORNER_WIDTH * SIZES.PX,
                borderBottomRightRadius: RADII.CHIP_SM * SIZES.PX,
            },
            laser: {
                position: 'absolute',
                left: LASER_INSET * SIZES.PX,
                right: LASER_INSET * SIZES.PX,
                top: LASER_INSET * SIZES.PX,
                height: 2 * SIZES.PX,
                backgroundColor: COLORS.ACCENT.Lime,
                // Свечение макета (box-shadow) на Android не отрисуется —
                // там останется просто лаймовая полоса.
                shadowColor: COLORS.ACCENT.Lime,
                shadowOpacity: 0.9,
                shadowRadius: 12 * SIZES.PX,
                shadowOffset: { width: 0, height: 0 },
            },
            hint: {
                position: 'absolute',
                bottom: 18 * SIZES.PX,
                // Подпись лежит на тёмном кадре камеры, а не на фоне темы,
                // поэтому она белая в обеих палитрах.
                opacity: 0.7,
            },
        })

        return (
            <View style={styles.container} pointerEvents="none">
                <View style={styles.frame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                    <Animated.View style={[styles.laser, laserStyle]} />
                </View>
                <Typography
                    type="body13"
                    customColor={COLORS.TEXT.Invert}
                    textAlign="center"
                    style={styles.hint}
                >
                    {hint}
                </Typography>
            </View>
        )
    }
)
