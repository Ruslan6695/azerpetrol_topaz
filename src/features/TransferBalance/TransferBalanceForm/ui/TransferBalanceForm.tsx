import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    divideNumber,
    ESCREENS,
    RADII,
    SIZES,
    SPACING,
    UserStore,
} from '../../../../shared'
import { AmountField } from '../../../../shared/AmountField'
import { GlassCard } from '../../../../shared/GlassCard'
import { GlassInput } from '../../../../shared/GlassInput'
import { Icon } from '../../../../shared/Icons'
import { PillButton } from '../../../../shared/PillButton'
import { Typography } from '../../../../shared/Typography'
import { TTransferPayload } from '../config/types/TTransferPayload'
import { TransferDraftStore } from '../model/transferDraftStore'

type Props = {
    name?: string
    phone?: string
    onTransfer: (payload: TTransferPayload) => void
}

// Длина телефона по маске «8 999 999 99 99» после того, как GlassInput
// вырезал пробелы.
const PHONE_LENGTH = 11

export const TransferBalanceForm = memo(
    ({ name, phone, onTransfer }: Props) => {
        const balance = UserStore.useBalance()
        const router = useRouter()
        const phoneValue = TransferDraftStore.usePhone()
        const sum = TransferDraftStore.useSum()
        const setPhone = TransferDraftStore.useSetPhone()
        const setSum = TransferDraftStore.useSetSum()

        const handleOpenContacts = useCallback(() => {
            // Цель возврата передаём явно: MapContacts имеет дефолт на этот экран,
            // и без параметра связь между экранами остаётся неявной.
            router.navigate({
                pathname: ESCREENS.CONTACTS,
                params: { onSelectLink: ESCREENS.TRANSFER_BALANCE },
            })
        }, [router])

        const handleSubmit = useCallback(() => {
            onTransfer({ name, phone: phoneValue, sum })
        }, [onTransfer, name, phoneValue, sum])

        const styles = StyleSheet.create({
            container: {
                gap: SPACING.MD * SIZES.PX,
            },
            amount: {
                marginTop: SPACING.SM * SIZES.PX,
            },
        })

        // Телефон, выбранный на экране контактов, приходит route-параметром.
        useEffect(() => {
            if (phone) setPhone(phone)
        }, [phone, setPhone])

        return (
            <View style={styles.container}>
                <GlassInput
                    mask="8 999 999 99 99"
                    keyboardType="numeric"
                    onChangeText={setPhone}
                    value={phoneValue}
                    placeholder="Введите номер телефона"
                    icon={<Icon name="phone" size={20} opacity={0.6} />}
                />

                <PillButton
                    title="Выбрать из контактов"
                    variant="secondary"
                    size="md"
                    onPress={handleOpenContacts}
                    icon={<Icon name="person" size={18} />}
                />

                <GlassCard
                    variant="glass2"
                    radius={RADII.HERO_SM}
                    paddingTop={22}
                    paddingHorizontal={SPACING.SCREEN}
                    paddingBottom={18}
                >
                    <Typography type="eyebrow">Сумма перевода</Typography>

                    <AmountField
                        value={sum}
                        onChangeValue={setSum}
                        suffix="₽"
                        fontSize={40}
                        fullWidth
                        max={balance}
                        style={styles.amount}
                    />

                    <Typography
                        type="caption12"
                        color="secondary"
                        marginsPaddings={{ mt: 8 }}
                    >
                        {`Доступно: ${divideNumber(balance)} ₽`}
                    </Typography>
                </GlassCard>

                <PillButton
                    title="Перевести"
                    onPress={handleSubmit}
                    disabled={phoneValue.length < PHONE_LENGTH || sum <= 0}
                />
            </View>
        )
    }
)
