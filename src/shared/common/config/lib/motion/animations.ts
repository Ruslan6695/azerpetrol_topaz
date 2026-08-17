import {
    EntryExitAnimationFunction,
    withDelay,
    withTiming,
} from 'react-native-reanimated'
import { MOTION } from '../../constants/MOTION'
import { SIZES } from '../../constants/sizes'
import { EASING } from './easing'

// Анимации входа макета. Готовые билдеры реанимейтеда (FadeInDown, ZoomIn)
// не подходят: ни один не даёт одновременно сдвиг и масштаб, а withInitialValues
// задаёт только точку старта — до scale: 1 такой билдер не доедет.
// Все три — фабрики: значения в пикселях считаются до 'worklet', потому что
// SIZES.PX внутри воркета брать нельзя.

// screenIn макета: opacity 0→1, translateY 16→0, scale .985→1.
// Ставится на смену таба в (main) и на вход логина/регистрации — там,
// где нативного перехода нет.
export const screenIn = (
    duration: number = MOTION.SCREEN_IN
): EntryExitAnimationFunction => {
    const shift = 16 * SIZES.PX
    return () => {
        'worklet'
        const config = { duration, easing: EASING.SCREEN }
        return {
            initialValues: {
                opacity: 0,
                transform: [{ translateY: shift }, { scale: 0.985 }],
            },
            animations: {
                opacity: withTiming(1, config),
                transform: [
                    { translateY: withTiming(0, config) },
                    { scale: withTiming(1, config) },
                ],
            },
        }
    }
}

// Появление контента вместо скелетона и элементов каскада: тот же почерк,
// короче и мягче, без масштаба.
export const contentIn = (delay: number = 0): EntryExitAnimationFunction => {
    const shift = 8 * SIZES.PX
    return () => {
        'worklet'
        const config = { duration: MOTION.CONTENT_IN, easing: EASING.SCREEN }
        return {
            initialValues: { opacity: 0, transform: [{ translateY: shift }] },
            animations: {
                opacity: withDelay(delay, withTiming(1, config)),
                transform: [
                    { translateY: withDelay(delay, withTiming(0, config)) },
                ],
            },
        }
    }
}

// «Поп» круга состояния: пружинистая кривая макета от ручки свитча.
export const popIn = (delay: number = 0): EntryExitAnimationFunction => {
    return () => {
        'worklet'
        const config = { duration: MOTION.POP, easing: EASING.SPRINGY }
        return {
            initialValues: { opacity: 0, transform: [{ scale: 0.8 }] },
            animations: {
                opacity: withDelay(delay, withTiming(1, config)),
                transform: [{ scale: withDelay(delay, withTiming(1, config)) }],
            },
        }
    }
}
