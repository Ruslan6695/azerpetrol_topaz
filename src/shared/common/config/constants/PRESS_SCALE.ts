import { MOTION } from './MOTION'

// Масштаб при нажатии из макета «21 Век»: чем крупнее элемент, тем слабее отклик.
// Применяется через shared/PressableScale.
export const PRESS_SCALE = {
    BUTTON: 0.96,
    CHIP: 0.95,
    TILE: 0.95,
    CARD: 0.97,
    ROW: 0.97,
    BACK: 0.9,
    TAB: 0.88,
} as const

// transition: transform .15s из макета. Живёт в общей шкале движения,
// здесь только реэкспорт под привычным именем.
export const PRESS_DURATION = MOTION.PRESS
