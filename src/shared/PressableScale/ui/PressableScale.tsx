import { ReactNode, memo, useCallback } from 'react'
import { Keyboard, Pressable, StyleProp, ViewStyle } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import {
    PRESS_DURATION,
    PRESS_SCALE,
} from '../../common/config/constants/PRESS_SCALE'

type Props = {
    children: ReactNode
    onPress?: () => void
    onLongPress?: () => void
    scaleTo?: number
    disabled?: boolean
    style?: StyleProp<ViewStyle>
    hitSlop?: number
    dismissKeyboard?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// Отклик нажатия из макета: transform: scale() за 150 мс.
// Как и CustomTouchableOpacity, по умолчанию прячет клавиатуру.
export const PressableScale = memo(
    ({
        children,
        onPress,
        onLongPress,
        scaleTo = PRESS_SCALE.BUTTON,
        disabled,
        style,
        hitSlop,
        dismissKeyboard = true,
    }: Props) => {
        const scale = useSharedValue(1)

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
        }))

        const handlePressIn = useCallback(() => {
            scale.value = withTiming(scaleTo, { duration: PRESS_DURATION })
        }, [scale, scaleTo])

        const handlePressOut = useCallback(() => {
            scale.value = withTiming(1, { duration: PRESS_DURATION })
        }, [scale])

        const handlePress = useCallback(() => {
            if (dismissKeyboard) {
                Keyboard.dismiss()
            }
            onPress?.()
        }, [dismissKeyboard, onPress])

        return (
            <AnimatedPressable
                disabled={disabled}
                onPress={handlePress}
                onLongPress={onLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                hitSlop={hitSlop}
                style={[style, animatedStyle]}
            >
                {children}
            </AnimatedPressable>
        )
    }
)
