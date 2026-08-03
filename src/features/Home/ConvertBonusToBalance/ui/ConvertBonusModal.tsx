import { memo, useCallback, useMemo } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import {
    divideNumber,
    FONTS,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { CustomModal } from '../../../../shared/CustomModal'
import { Icon } from '../../../../shared/Icons'
import { PillButton } from '../../../../shared/PillButton'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'
import { PRESS_SCALE } from '../../../../shared/common/config/constants/PRESS_SCALE'

type Props = {
    isOpened: boolean
    /** Сколько бонусов доступно к переводу */
    max: number
    amount: number
    isLoading: boolean
    onChangeAmount: (amount: number) => void
    onConfirm: () => void
    onClose: () => void
}

// Модалка перевода бонусов на основной счёт. Курс 1 B = 1 ₽, поэтому
// сумма в рублях равна количеству бонусов и отдельно не считается.
export const ConvertBonusModal = memo(
    ({
        isOpened,
        max,
        amount,
        isLoading,
        onChangeAmount,
        onConfirm,
        onClose,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

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
                        borderRadius: 32 * SIZES.PX,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.ACCENT.PrimarySoft,
                    },
                    field: {
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5 * SIZES.PX,
                        backgroundColor: COLORS.GLASS.Primary,
                        borderWidth: 1.5 * SIZES.PX,
                        borderColor: COLORS.ACCENT.Primary,
                        borderRadius: 18 * SIZES.PX,
                        paddingVertical: SPACING.LG * SIZES.PX,
                        paddingHorizontal: 18 * SIZES.PX,
                    },
                    input: {
                        minWidth: 110 * SIZES.PX,
                        textAlign: 'center',
                        padding: 0,
                        fontFamily: FONTS.EXTRABOLD,
                        fontSize: 30 * SIZES.PX,
                        color: COLORS.TEXT.Primary,
                    },
                    presets: {
                        flexDirection: 'row',
                        gap: SPACING.SM * SIZES.PX,
                        width: '100%',
                    },
                    preset: {
                        flex: 1,
                        alignItems: 'center',
                        borderRadius: RADII.PILL,
                        backgroundColor: COLORS.GLASS.Primary,
                        borderWidth: 1,
                        borderColor: COLORS.GLASS.Border,
                        paddingVertical: 9 * SIZES.PX,
                    },
                    buttons: {
                        width: '100%',
                        gap: SPACING.SM * SIZES.PX,
                    },
                }),
            [COLORS]
        )

        // Ввод зажимается в [0, max] прямо здесь: иначе можно отправить
        // перевод больше, чем есть бонусов.
        const handleChangeText = useCallback(
            (text: string) => {
                const parsed = parseInt(text.replace(/\D/g, ''), 10)
                onChangeAmount(
                    isNaN(parsed) ? 0 : Math.max(0, Math.min(max, parsed))
                )
            },
            [max, onChangeAmount]
        )

        const handleHalf = useCallback(
            () => onChangeAmount(Math.floor(max / 2)),
            [max, onChangeAmount]
        )
        const handleAll = useCallback(
            () => onChangeAmount(max),
            [max, onChangeAmount]
        )

        return (
            <CustomModal
                isModalOpened={isOpened}
                handleClose={onClose}
                closeOutside
                bgDark
                animationType="fade"
                width="100%"
                radius={28}
            >
                <View style={styles.content}>
                    <View style={styles.iconCircle}>
                        <Icon
                            name="convert"
                            size={28}
                            color={COLORS.ACCENT.Primary}
                        />
                    </View>

                    <Typography type="num18" textAlign="center">
                        Перевести бонусы на счёт
                    </Typography>
                    <Typography
                        type="body125"
                        color="secondary"
                        textAlign="center"
                    >
                        Доступно {divideNumber(max)} B · 1 B = 1 ₽
                    </Typography>

                    <View style={styles.field}>
                        <TextInput
                            value={String(amount)}
                            onChangeText={handleChangeText}
                            keyboardType="number-pad"
                            selectTextOnFocus
                            style={styles.input}
                        />
                        <Typography type="num16" color="secondary">
                            B
                        </Typography>
                    </View>

                    <View style={styles.presets}>
                        <PressableScale
                            onPress={handleHalf}
                            scaleTo={PRESS_SCALE.CHIP}
                            style={styles.preset}
                        >
                            <Typography type="label13">Половина</Typography>
                        </PressableScale>
                        <PressableScale
                            onPress={handleAll}
                            scaleTo={PRESS_SCALE.CHIP}
                            style={styles.preset}
                        >
                            <Typography type="label13">
                                Все {divideNumber(max)} B
                            </Typography>
                        </PressableScale>
                    </View>

                    <View style={styles.buttons}>
                        <PillButton
                            title={`Перевести ${divideNumber(amount)} ₽`}
                            onPress={onConfirm}
                            loading={isLoading}
                            disabled={amount <= 0}
                            size="lg"
                        />
                        <PillButton
                            title="Отмена"
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
