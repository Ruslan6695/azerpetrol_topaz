import { ReactNode, memo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { SPACING } from '../../common/config/constants/SPACING'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'

type Props = {
    title: string
    onPress: () => void
    icon?: ReactNode
    disabled?: boolean
    style?: StyleProp<ViewStyle>
}

// Текстовая ссылка макета: label13 цвета ACCENT.Primary, без фона и рамки.
// В макете у неё нет :active-состояния, поэтому scaleTo не задаём —
// PressableScale берётся ради единого hitSlop и dismissKeyboard.
export const LinkButton = memo(
    ({ title, onPress, icon, disabled, style }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: SPACING.SM * SIZES.PX,
                paddingVertical: SPACING.SM * SIZES.PX,
            },
        })

        return (
            <PressableScale
                onPress={onPress}
                disabled={disabled}
                scaleTo={1}
                hitSlop={8}
                style={[styles.container, style]}
            >
                {icon && <View>{icon}</View>}
                <Typography
                    type="label13"
                    customColor={
                        disabled ? COLORS.TEXT.Tertiary : COLORS.ACCENT.Primary
                    }
                >
                    {title}
                </Typography>
            </PressableScale>
        )
    }
)
