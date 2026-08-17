import { memo, useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    divideNumber,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { AmountField } from '../../../../shared/AmountField'
import { Chip } from '../../../../shared/Chip'
import { CustomModal } from '../../../../shared/CustomModal'
import { Icon } from '../../../../shared/Icons'
import { PillButton } from '../../../../shared/PillButton'
import { Typography } from '../../../../shared/Typography'

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
                        borderRadius: RADII.PILL,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.ACCENT.PrimarySoft,
                    },
                    presets: {
                        flexDirection: 'row',
                        gap: SPACING.SM * SIZES.PX,
                        width: '100%',
                    },
                    // Чипы делят ширину поровну, поэтому подпись центруется
                    // здесь, а не внутри Chip — там она прижата к иконке.
                    preset: {
                        flex: 1,
                        justifyContent: 'center',
                    },
                    buttons: {
                        width: '100%',
                        gap: SPACING.SM * SIZES.PX,
                    },
                }),
            [COLORS]
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

                    <AmountField
                        value={amount}
                        onChangeValue={onChangeAmount}
                        suffix="B"
                        align="center"
                        fullWidth
                        fontSize={30}
                        max={max}
                    />

                    <View style={styles.presets}>
                        <Chip
                            label="Половина"
                            onPress={handleHalf}
                            style={styles.preset}
                        />
                        <Chip
                            label={`Все ${divideNumber(max)} B`}
                            onPress={handleAll}
                            style={styles.preset}
                        />
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
