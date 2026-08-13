import { ReactNode, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { ThemeStore } from '../../common/model/themeStore'
import { PillButton } from '../../PillButton'
import { TPillButtonVariants } from '../../PillButton/config/types/TPillButtonVariants'
import { Typography } from '../../Typography'
import { TCenteredStateVariants } from '../config/types/TCenteredStateVariants'

type Props = {
    variant?: TCenteredStateVariants
    title: string
    description?: string
    /** Содержимое круга. Если не передано — берётся символ по варианту */
    icon?: ReactNode
    /** Диаметр круга в единицах макета. По умолчанию 96 */
    circleSize?: number
    action?: {
        label: string
        onPress: () => void
        /** По умолчанию 'elevated'; 'primary' — когда состояние ведёт к главному действию */
        variant?: TPillButtonVariants
        loading?: boolean
        disabled?: boolean
    }
    secondaryAction?: {
        label: string
        onPress: () => void
    }
}

// Центрированное состояние из макета: круг 96 → заголовок → тело → CTA.
export const CenteredState = memo(
    ({
        variant = 'empty',
        title,
        description,
        icon,
        circleSize = 96,
        action,
        secondaryAction,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const circleBg =
            variant === 'success'
                ? COLORS.ACCENT.Lime
                : variant === 'error'
                  ? COLORS.STATE.DestructiveSoft
                  : COLORS.GLASS.Secondary
        const glyphColor =
            variant === 'success'
                ? COLORS.ACCENT.OnLime
                : variant === 'error'
                  ? COLORS.STATE.Destructive
                  : COLORS.TEXT.Primary
        const glyph =
            variant === 'success' ? '✓' : variant === 'error' ? '!' : ''

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16 * SIZES.PX,
                paddingVertical: 60 * SIZES.PX,
            },
            circle: {
                width: circleSize * SIZES.PX,
                height: circleSize * SIZES.PX,
                borderRadius: RADII.PILL,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: circleBg,
                borderWidth: variant === 'empty' ? 1 : 0,
                borderColor:
                    variant === 'empty' ? COLORS.GLASS.Border : undefined,
            },
            description: {
                maxWidth: 260 * SIZES.PX,
            },
            // В макете кнопка состояния — пилюля по ширине контента,
            // а не растянутая на всю ширину экрана
            actions: {
                gap: SPACING.ROW_GAP * SIZES.PX,
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 8 * SIZES.PX,
            },
            actionButton: {
                alignSelf: 'center',
            },
        })

        return (
            <View style={styles.container}>
                <View style={styles.circle}>
                    {icon ?? (
                        <Typography type="h1" customColor={glyphColor}>
                            {glyph}
                        </Typography>
                    )}
                </View>

                <Typography type="h5" textAlign="center">
                    {title}
                </Typography>

                {description && (
                    <View style={styles.description}>
                        <Typography
                            type="body14"
                            color="secondary"
                            textAlign="center"
                        >
                            {description}
                        </Typography>
                    </View>
                )}

                {(action || secondaryAction) && (
                    <View style={styles.actions}>
                        {action && (
                            <PillButton
                                title={action.label}
                                onPress={action.onPress}
                                variant={action.variant ?? 'elevated'}
                                loading={action.loading}
                                disabled={action.disabled}
                                fullWidth={false}
                                style={styles.actionButton}
                            />
                        )}
                        {secondaryAction && (
                            <PillButton
                                title={secondaryAction.label}
                                onPress={secondaryAction.onPress}
                                variant="secondary"
                                fullWidth={false}
                                style={styles.actionButton}
                            />
                        )}
                    </View>
                )}
            </View>
        )
    }
)
