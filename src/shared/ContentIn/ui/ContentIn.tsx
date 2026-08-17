import { ReactNode, memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { contentIn } from '../../common/config/lib/motion/animations'

type Props = {
    children: ReactNode
    style?: StyleProp<ViewStyle>
    /** Задержка появления в мс — для рассинхрона соседних блоков */
    delay?: number
}

// Появление блока после скелетона. Ставится ВМЕСТО корневого View блока,
// а не поверх него: если корневой View участвует во flex-раскладке, обёртка
// сверху сломала бы её, поэтому style передаётся насквозь.
//
// Настоящего кросс-фейда (оба дерева разом) тут нет намеренно: он потребовал бы
// абсолютного позиционирования одного из деревьев и обрушил бы высоту родителя.
// Скелетон и контент занимают одну область, и глаз читает подмену как кросс-фейд.
export const ContentIn = memo(({ children, style, delay }: Props) => (
    <Animated.View style={style} entering={contentIn(delay)}>
        {children}
    </Animated.View>
))
