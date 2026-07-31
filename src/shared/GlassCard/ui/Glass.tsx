import { BlurView } from 'expo-blur'
import { ReactNode, memo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
    BLUR_INTENSITY,
    CAN_BLUR,
} from '../../common/config/constants/BLUR'
import { ThemeStore } from '../../common/model/themeStore'
import { TGlassLevel } from '../config/types/TGlassLevel'

type Props = {
    children: ReactNode
    level?: TGlassLevel
    radius: number
    blur?: boolean
    bordered?: boolean
    style?: StyleProp<ViewStyle>
}

// ЕДИНСТВЕННОЕ место в проекте, где импортируется BlurView.
//
// На Android настоящий backdrop-blur требует экспериментального dimezisBlurView,
// который перерисовывает иерархию каждый кадр — под скроллом это просадка FPS.
// Поэтому там (и при blur={false}) отдаём непрозрачные GLASS.Solid*: это цвет
// стекла, предкомпозированный на фон, — выглядит намеренно, а не сломанно.
//
// Порядок вложенности важен: на Android overflow:'hidden' гасит elevation,
// поэтому тень вешается снаружи, а скругление и блюр — на внутреннем View.
export const Glass = memo(
    ({
        children,
        level = 'primary',
        radius,
        blur = true,
        bordered = true,
        style,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const useBlur = blur && CAN_BLUR
        const translucent =
            level === 'secondary' ? COLORS.GLASS.Secondary : COLORS.GLASS.Primary
        const solid =
            level === 'secondary'
                ? COLORS.GLASS.SolidSecondary
                : COLORS.GLASS.SolidPrimary

        const styles = StyleSheet.create({
            container: {
                borderRadius: radius,
                overflow: 'hidden',
                backgroundColor: useBlur ? translucent : solid,
                borderWidth: bordered ? 1 : 0,
                borderColor: bordered ? COLORS.GLASS.Border : undefined,
            },
        })

        return (
            <View style={[styles.container, style]}>
                {useBlur && (
                    <BlurView
                        intensity={BLUR_INTENSITY}
                        tint={COLORS.EFFECTS.BlurTint}
                        style={StyleSheet.absoluteFill}
                    />
                )}
                {children}
            </View>
        )
    }
)
