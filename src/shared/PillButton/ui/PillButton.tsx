import { ReactNode, memo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { Loader } from '../../Loader'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'
import { TTypographyTypes } from '../../Typography/config/types/TTypographyTypes'
import {
    TPillButtonSizes,
    TPillButtonVariants,
} from '../config/types/TPillButtonVariants'

type Props = {
    title: string
    onPress: () => void
    variant?: TPillButtonVariants
    size?: TPillButtonSizes
    disabled?: boolean
    loading?: boolean
    icon?: ReactNode
    fullWidth?: boolean
    style?: StyleProp<ViewStyle>
}

// Высоты и типографика — из макета (design/DESIGN_SPEC.md, «Кнопки-пилюли»).
const SIZE_MAP: Record<
    TPillButtonSizes,
    { height: number; type: TTypographyTypes; secondaryType: TTypographyTypes }
> = {
    lg: { height: 54, type: 'num15', secondaryType: 'rowTitle' },
    md: { height: 46, type: 'num15', secondaryType: 'label14' },
    sm: { height: 40, type: 'label13', secondaryType: 'label13' },
}

export const PillButton = memo(
    ({
        title,
        onPress,
        variant = 'primary',
        size = 'lg',
        disabled,
        loading,
        icon,
        fullWidth = true,
        style,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const { height, type, secondaryType } = SIZE_MAP[size]

        const isPrimary = variant === 'primary'
        const isDestructive = variant === 'destructive'
        const isBordered = variant === 'secondary' || variant === 'elevated'

        const backgroundColor = disabled
            ? COLORS.STATE.Disabled
            : isPrimary
            ? COLORS.ACCENT.Lime
            : isDestructive
            ? COLORS.STATE.Destructive
            : variant === 'elevated'
            ? COLORS.GLASS.Secondary
            : COLORS.GLASS.Primary

        const textColor = disabled
            ? COLORS.TEXT.Tertiary
            : isPrimary
            ? COLORS.ACCENT.OnLime
            : isDestructive
            ? COLORS.TEXT.Invert
            : COLORS.TEXT.Primary

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8 * SIZES.PX,
                height: height * SIZES.PX,
                paddingHorizontal: 24 * SIZES.PX,
                borderRadius: RADII.PILL,
                backgroundColor,
                borderWidth: isBordered ? 1 : 0,
                borderColor: isBordered ? COLORS.GLASS.Border : undefined,
                width: fullWidth ? '100%' : undefined,
                alignSelf: fullWidth ? 'stretch' : 'flex-start',
            },
        })

        return (
            <PressableScale
                onPress={onPress}
                disabled={disabled || loading}
                scaleTo={PRESS_SCALE.BUTTON}
                style={[styles.container, style]}
            >
                {loading ? (
                    <Loader small customColor={textColor} />
                ) : (
                    <>
                        {icon && <View>{icon}</View>}
                        <Typography
                            type={
                                isPrimary || isDestructive
                                    ? type
                                    : secondaryType
                            }
                            customColor={textColor}
                        >
                            {title}
                        </Typography>
                    </>
                )}
            </PressableScale>
        )
    }
)
