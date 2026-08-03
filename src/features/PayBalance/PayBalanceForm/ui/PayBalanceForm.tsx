import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    divideNumber,
    RADII,
    SIZES,
    SPACING,
    useSendFetch,
} from '../../../../shared'
import { AmountField } from '../../../../shared/AmountField'
import { Chip } from '../../../../shared/Chip'
import { GlassCard } from '../../../../shared/GlassCard'
import { PillButton } from '../../../../shared/PillButton'
import { Typography } from '../../../../shared/Typography'
import { payBalanceFormApi } from '../api/payBalanceFormApi'
import { DEFAULT_PAY_SUM } from '../config/constants/DEFAULT_PAY_SUM'
import { QUICK_SUMS } from '../config/constants/QUICK_SUMS'
import { IPayBalanceFormData } from '../config/interfaces/IPayBalanceFormData'

type Props = {
    onPay: (order: IPayBalanceFormData) => void
    /** Сумма, переданная параметром маршрута — например нехватка средств при наливе */
    sum: string | null
}

export const PayBalanceForm = memo(({ onPay, sum }: Props) => {
    const [amount, setAmount] = useState(sum ? Number(sum) : DEFAULT_PAY_SUM)
    const { isSendFetchLoading, sendFetch } = useSendFetch<
        number,
        IPayBalanceFormData
    >({
        apiCallback: payBalanceFormApi.pay,
        errorText: 'Ошибка при пополнении баланса',
    })

    const handleSubmit = useCallback(() => {
        sendFetch({
            args: amount,
            afterDataCallback(data) {
                onPay(data)
            },
        })
    }, [onPay, amount, sendFetch])

    const styles = StyleSheet.create({
        container: {
            gap: SPACING.MD * SIZES.PX,
        },
        amount: {
            marginTop: SPACING.SM * SIZES.PX,
        },
        chips: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.SM * SIZES.PX,
            marginTop: SPACING.LG * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <GlassCard
                variant="glass2"
                radius={RADII.HERO_SM}
                paddingTop={22}
                paddingHorizontal={SPACING.SCREEN}
                paddingBottom={18}
            >
                <Typography type="eyebrow">Сумма пополнения</Typography>

                <AmountField
                    value={amount}
                    onChangeValue={setAmount}
                    suffix="₽"
                    style={styles.amount}
                />

                <View style={styles.chips}>
                    {QUICK_SUMS.map((quickSum) => (
                        <Chip
                            key={quickSum}
                            label={divideNumber(quickSum)}
                            selected={amount === quickSum}
                            onPress={() => setAmount(quickSum)}
                        />
                    ))}
                </View>
            </GlassCard>

            <PillButton
                title="Перейти к оплате"
                onPress={handleSubmit}
                loading={isSendFetchLoading}
                disabled={amount <= 0}
            />
        </View>
    )
})
