import { memo } from 'react'
import Animated, {
    SharedValue,
    useAnimatedProps,
} from 'react-native-reanimated'
import { Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type Props = {
    /** Доля окружности, пройденная общей отрисовкой кольца: 0 → 1 */
    progress: SharedValue<number>
    box: number
    radius: number
    stroke: number
    color: string
    circumference: number
    /** Начало дуги в единицах длины окружности */
    start: number
    /** Длина дуги в единицах длины окружности */
    length: number
}

// Одна дуга кольца. Отдельным компонентом, потому что useAnimatedProps нельзя
// звать внутри .map() — на каждую дугу нужен свой хук.
//
// Анимируется длина штриха, а не strokeDashoffset как в ProgressRing: при
// фиксированной длине сдвиг увёл бы дугу на территорию соседнего сегмента
// и закрасил бы её своим цветом. Общая прогрессия одна на всё кольцо, поэтому
// сегменты подхватывают отрисовку эстафетой, а не рисуются одновременно.
export const DonutArc = memo(
    ({
        progress,
        box,
        radius,
        stroke,
        color,
        circumference,
        start,
        length,
    }: Props) => {
        const animatedProps = useAnimatedProps(() => {
            const drawn = Math.min(
                Math.max(progress.value * circumference - start, 0),
                length
            )
            return { strokeDasharray: [drawn, circumference] }
        })

        return (
            <AnimatedCircle
                cx={box / 2}
                cy={box / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeDashoffset={-start}
                animatedProps={animatedProps}
            />
        )
    }
)
