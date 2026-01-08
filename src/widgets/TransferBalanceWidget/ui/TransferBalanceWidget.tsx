import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import { MapInfoBlocks } from '../../../features/MapInfoBlocks'
import { TransferBalanceConfirm } from '../../../features/TransferBalance/TransferBalanceConfirm'
import { TransferBalanceForm } from '../../../features/TransferBalance/TransferBalanceForm'
import { TTRansferScreenParams } from '../../../shared'
import { TRANSFER_BALANCE_INFO_TEXTS } from '../constants/TRANSFER_BALANCE_INFO_TEXTS'

type Props = {
    params: Partial<TTRansferScreenParams> // тип Partial делает все параметры внутри необязательными
}

export const TransferBalanceWidget = ({ params }: Props) => {
    const [state, setState] = useState<{
        name?: string
        phone: string
        sum: number
    }>({ name: undefined, phone: '', sum: 0 })
    const [isOnConfirm, setisOnConfirm] = useState(false)

    const handleChangeState = useCallback(
        (state: { name?: string; phone: string; sum: number }) => {
            setState(state)
            setisOnConfirm(true)
        },
        []
    )

    const handleGoBackFromConfirm = useCallback(() => {
        setisOnConfirm(false)
    }, [])

    return (
        <View style={styles.container}>
            <ScreenTitle title="Перевести средства" />
            {isOnConfirm ? (
                <TransferBalanceConfirm
                    onGoBack={handleGoBackFromConfirm}
                    name={state.name}
                    phone={state.phone}
                    sum={state.sum}
                />
            ) : (
                <TransferBalanceForm
                    name={params.name}
                    phone={params.phone}
                    onTransfer={handleChangeState}
                />
            )}

            <MapInfoBlocks infoBlocks={TRANSFER_BALANCE_INFO_TEXTS} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
})
