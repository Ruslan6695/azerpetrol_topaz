import { ReactNode, memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { ThemeStore } from '../../common/model/themeStore'
import { CustomModal } from '../../CustomModal'
import { PillButton } from '../../PillButton'
import { Typography } from '../../Typography'
import { TConfirmDialogVariants } from '../config/types/TConfirmDialogVariants'

type Props = {
    isOpened: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description?: string
    confirmLabel: string
    cancelLabel?: string
    variant?: TConfirmDialogVariants
    /** Содержимое круга. По умолчанию — глиф «!» */
    icon?: ReactNode
    loading?: boolean
}

// Диалог подтверждения из макета: круг 64 → заголовок → тело → две кнопки.
// Одна оболочка на все подтверждалки приложения — иначе одно и то же действие
// выглядит по-разному на разных экранах.
export const ConfirmDialog = memo(
    ({
        isOpened,
        onClose,
        onConfirm,
        title,
        description,
        confirmLabel,
        cancelLabel = 'Отмена',
        variant = 'destructive',
        icon,
        loading,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const isDestructive = variant === 'destructive'
        const accentColor = isDestructive
            ? COLORS.STATE.Destructive
            : COLORS.ACCENT.Primary

        const styles = useMemo(
            () =>
                StyleSheet.create({
                    content: {
                        alignItems: 'center',
                        gap: SPACING.LG * SIZES.PX,
                    },
                    iconCircle: {
                        width: 64 * SIZES.PX,
                        height: 64 * SIZES.PX,
                        borderRadius: RADII.PILL,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDestructive
                            ? COLORS.STATE.DestructiveSoft
                            : COLORS.ACCENT.PrimarySoft,
                    },
                    buttons: {
                        width: '100%',
                        gap: SPACING.SM * SIZES.PX,
                    },
                }),
            [COLORS, isDestructive]
        )

        return (
            <CustomModal
                isModalOpened={isOpened}
                handleClose={onClose}
                closeOutside
                bgDark
                hideHeader
                animationType="fade"
                width="100%"
                radius={RADII.HERO_SM}
            >
                <View style={styles.content}>
                    <View style={styles.iconCircle}>
                        {icon ?? (
                            <Typography type="h5" customColor={accentColor}>
                                !
                            </Typography>
                        )}
                    </View>

                    <Typography type="num18" textAlign="center">
                        {title}
                    </Typography>

                    {description && (
                        <Typography
                            type="body125"
                            color="secondary"
                            textAlign="center"
                        >
                            {description}
                        </Typography>
                    )}

                    <View style={styles.buttons}>
                        <PillButton
                            title={confirmLabel}
                            onPress={onConfirm}
                            variant={isDestructive ? 'destructive' : 'primary'}
                            loading={loading}
                            size="lg"
                        />
                        <PillButton
                            title={cancelLabel}
                            onPress={onClose}
                            variant="secondary"
                            size="lg"
                        />
                    </View>
                </View>
            </CustomModal>
        )
    }
)
