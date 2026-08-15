import { ReactNode, memo, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type Props = {
    /** Доля заполнения, 0…1. Значения вне диапазона клампятся */
    progress: number
    /** Диаметр в единицах макета. По умолчанию 150 (dc.html:576) */
    size?: number
    /** Толщина дуги в единицах макета. По умолчанию 10 */
    strokeWidth?: number
    trackColor?: string
    progressColor?: string
    /** Длительность догона значения, мс */
    duration?: number
    /** Содержимое центра кольца */
    children?: ReactNode
}

// Кольцо прогресса из макета (dc.html:576–578): фоновая дуга + лаймовая
// поверх, скруглённые концы, старт с 12 часов.
//
// Анимируется strokeDashoffset, а не strokeDasharray: длина штриха задаётся
// один раз, а сдвиг живёт в UI-потоке — при поллинге раз в секунду это
// избавляет от перерисовки экрана на каждый тик.
export const ProgressRing = memo(
    ({
        progress,
        size = 150,
        strokeWidth = 10,
        trackColor,
        progressColor,
        duration = 400,
        children,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const box = size * SIZES.PX
        const stroke = strokeWidth * SIZES.PX
        // Радиус считаем от фактического бокса: длину окружности из макета
        // (402 = 2π·64) брать литералом нельзя — размер домножен на SIZES.PX
        // и дуга разъедется.
        const radius = (box - stroke) / 2
        const circumference = 2 * Math.PI * radius

        const offset = useSharedValue(circumference)

        useEffect(() => {
            const clamped = Math.min(1, Math.max(0, progress || 0))
            offset.value = withTiming(circumference * (1 - clamped), {
                duration,
            })
        }, [progress, circumference, duration])

        const animatedProps = useAnimatedProps(() => ({
            strokeDashoffset: offset.value,
        }))

        const styles = StyleSheet.create({
            container: {
                width: box,
                height: box,
                alignItems: 'center',
                justifyContent: 'center',
            },
            // Дуга рисуется от 3 часов — разворачиваем на 12.
            svg: {
                transform: [{ rotate: '-90deg' }],
            },
        })

        return (
            <View style={styles.container}>
                <Svg
                    width={box}
                    height={box}
                    style={[StyleSheet.absoluteFill, styles.svg]}
                >
                    <Circle
                        cx={box / 2}
                        cy={box / 2}
                        r={radius}
                        fill="none"
                        stroke={trackColor ?? COLORS.GLASS.Secondary}
                        strokeWidth={stroke}
                    />
                    <AnimatedCircle
                        cx={box / 2}
                        cy={box / 2}
                        r={radius}
                        fill="none"
                        stroke={progressColor ?? COLORS.ACCENT.Lime}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animatedProps={animatedProps}
                    />
                </Svg>
                {children}
            </View>
        )
    }
)
