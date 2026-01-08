import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import { MapInfoBlocks } from '../../../features/MapInfoBlocks'
import {
    IPayBalanceFormData,
    PayBalanceForm,
} from '../../../features/PayBalance/PayBalanceForm'
import { PAY_BALANCE_INFO_TEXTS } from '../constants/PAY_BALANCE_INFO_TEXTS'
import { PayBalanceSelectBank } from '../../../features/PayBalance/PayBalanceSelectBank'
import { PayBalanceWaiting } from '../../../features/PayBalance/PayBalanceWaiting'
import { TPayBalanceScreenParams } from '../../../shared'

type Props = {
    params: Partial<TPayBalanceScreenParams>
}

export const PayBalanceWidget = memo(({ params }: Props) => {
    const [road, setRoad] = useState<'changeSum' | 'selectBank' | 'waiting'>(
        'waiting'
    )
    const [orderData, setOrderData] = useState<IPayBalanceFormData>()
    const handleSetOrderData = useCallback((order: IPayBalanceFormData) => {
        setOrderData(order)
        setRoad('selectBank')
    }, [])

    const handleSelectBank = useCallback(() => {
        setRoad('waiting')
    }, [])

    const handleGoBackToSelectBank = useCallback(() => {
        setRoad('selectBank')
    }, [])

    return (
        <>
            <ScreenTitle title="Пополните баланс" />
            {road === 'waiting' && orderData ? (
                <PayBalanceWaiting
                    backLink={params.backLink}
                    onGoBack={handleGoBackToSelectBank}
                    payId={orderData?.id}
                />
            ) : road === 'selectBank' && orderData ? (
                <PayBalanceSelectBank
                    onSelectBank={handleSelectBank}
                    link={orderData?.link}
                />
            ) : (
                <>
                    <PayBalanceForm
                        sum={params.sum ? params.sum : null}
                        onPay={handleSetOrderData}
                    />
                    <MapInfoBlocks infoBlocks={PAY_BALANCE_INFO_TEXTS} />
                </>
            )}
        </>
    )
})
const styles = StyleSheet.create({
    container: {},
})
