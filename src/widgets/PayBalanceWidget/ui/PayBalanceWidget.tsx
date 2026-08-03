import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../entities/InfoCard'
import {
    IPayBalanceFormData,
    PayBalanceForm,
} from '../../../features/PayBalance/PayBalanceForm'
import { PayBalanceSelectBank } from '../../../features/PayBalance/PayBalanceSelectBank'
import { PayBalanceWaiting } from '../../../features/PayBalance/PayBalanceWaiting'
import { SIZES, SPACING, TPayBalanceScreenParams } from '../../../shared'
import { PAY_BALANCE_INFO_TEXTS } from '../constants/PAY_BALANCE_INFO_TEXTS'

type Props = {
    params: Partial<TPayBalanceScreenParams>
}

export const PayBalanceWidget = memo(({ params }: Props) => {
    // Шаг экрана и шит выбора банка живут отдельно: из ожидания
    // можно вернуться к банкам, не перерисовывая форму.
    const [step, setStep] = useState<'form' | 'waiting'>('form')
    const [isBankOpened, setIsBankOpened] = useState(false)
    const [orderData, setOrderData] = useState<IPayBalanceFormData>()

    const handleSetOrderData = useCallback((order: IPayBalanceFormData) => {
        setOrderData(order)
        setIsBankOpened(true)
    }, [])

    const handleSelectBank = useCallback(() => {
        setIsBankOpened(false)
        setStep('waiting')
    }, [])

    const handleGoBackToSelectBank = useCallback(() => {
        setIsBankOpened(true)
    }, [])

    const handleCloseBankSheet = useCallback(() => {
        setIsBankOpened(false)
    }, [])

    const styles = StyleSheet.create({
        infoList: {
            gap: SPACING.MD * SIZES.PX,
            marginTop: SPACING.SECTION * SIZES.PX,
        },
    })

    return (
        <>
            {step === 'waiting' && orderData ? (
                <PayBalanceWaiting
                    backLink={params.backLink}
                    onGoBack={handleGoBackToSelectBank}
                    payId={orderData.id}
                />
            ) : (
                <>
                    <PayBalanceForm
                        sum={params.sum ? params.sum : null}
                        onPay={handleSetOrderData}
                    />
                    <View style={styles.infoList}>
                        {PAY_BALANCE_INFO_TEXTS.map((infoBlock) => (
                            <InfoCard
                                key={infoBlock.title}
                                title={infoBlock.title}
                                info={infoBlock.info}
                            />
                        ))}
                    </View>
                </>
            )}

            <PayBalanceSelectBank
                isOpened={isBankOpened && !!orderData}
                link={orderData?.link ?? ''}
                onSelectBank={handleSelectBank}
                onClose={handleCloseBankSheet}
            />
        </>
    )
})
