import { MOTION } from '../../constants/MOTION'

// CSS-транзишены макета для Animated.View. Это прямой перенос
// `transition: background .25s` из прототипа: реанимейтед 4 понимает
// transitionProperty/transitionDuration прямо в стиле.
//
// Объекты создаются один раз на модуле и не пересоздаются на рендере.
// Пересоздание стилей через StyleSheet.create внутри компонента им не мешает:
// менеджер транзишенов сравнивает конфиг по значениям, а не по ссылке.
//
// Тип намеренно выводится, а не пишется как CSSTransitionProperties: у RN
// в ViewStyle есть свои веб-поля transition*, и явная аннотация конфликтует
// с ними по transitionDelay. `as const` сужает transitionProperty до литерала,
// чего достаточно обеим сторонам.

// Нижний таб-бар — background .25s (пилюля активной иконки).
export const TAB_BG_TRANSITION = {
    transitionProperty: 'backgroundColor',
    transitionDuration: `${MOTION.TAB}ms`,
    transitionTimingFunction: 'ease',
} as const

// Сегмент-контрол и чипы — background .2s.
// Рамку чипа в транзишен не берём: она пропадает вместе с borderWidth 1 → 0,
// а переход толщины дёргает раскладку.
export const SEGMENT_BG_TRANSITION = {
    transitionProperty: 'backgroundColor',
    transitionDuration: `${MOTION.SEGMENT}ms`,
    transitionTimingFunction: 'ease',
} as const

// Кросс-фейд активной иконки таба. Макет тонирует иконку через filter .25s,
// но color у <Icon> — проп <Svg>, а не стиль: транзишеном его не взять,
// поэтому активная копия иконки проявляется по opacity.
export const TAB_ICON_TRANSITION = {
    transitionProperty: 'opacity',
    transitionDuration: `${MOTION.TAB}ms`,
    transitionTimingFunction: 'ease',
} as const
