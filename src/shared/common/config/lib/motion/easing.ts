import { cubicBezier, Easing } from 'react-native-reanimated'
import { CURVE } from '../../constants/MOTION'

// Кривые макета в двух видах. Easing.bezier() и cubicBezier() — разные
// несовместимые объекты: первый понимает withTiming и entering-анимации,
// второй — только CSS-транзишены. Контрольные точки у них общие и лежат
// в CURVE, поэтому дубля значений нет.

// Для императивного API: withTiming, withDelay, кастомные entering.
export const EASING = {
    SCREEN: Easing.bezier(...CURVE.SCREEN),
    SPRINGY: Easing.bezier(...CURVE.SPRINGY),
    EASE: Easing.bezier(...CURVE.EASE),
}

// Для CSS-транзишенов на Animated.View (transitionTimingFunction).
export const CSS_EASING = {
    SCREEN: cubicBezier(...CURVE.SCREEN),
    SPRINGY: cubicBezier(...CURVE.SPRINGY),
}
