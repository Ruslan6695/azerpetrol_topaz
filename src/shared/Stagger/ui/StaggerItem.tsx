import { ReactNode, memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, { EntryExitAnimationFunction } from 'react-native-reanimated'

type Props = {
    children: ReactNode
    /** Результат getEntering(index) из useStagger. undefined — без анимации */
    entering?: EntryExitAnimationFunction
    style?: StyleProp<ViewStyle>
}

// Обёртка одного элемента каскада. Отдельным компонентом, а не Animated.View
// по месту, чтобы список не пересобирал анимацию на каждом рендере.
export const StaggerItem = memo(({ children, entering, style }: Props) => (
    <Animated.View style={style} entering={entering}>
        {children}
    </Animated.View>
))
