import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../entities/InfoCard'
import { TransferBalanceConfirm } from '../../../features/TransferBalance/TransferBalanceConfirm'
import {
    TTransferPayload,
    TransferBalanceForm,
    TransferDraftStore,
} from '../../../features/TransferBalance/TransferBalanceForm'
import { SIZES, SPACING, TTRansferScreenParams } from '../../../shared'
import { TRANSFER_BALANCE_INFO_TEXTS } from '../config/constants/TRANSFER_BALANCE_INFO_TEXTS'

type Props = {
    params: Partial<TTRansferScreenParams> // тип Partial делает все параметры внутри необязательными
}

export const TransferBalanceWidget = memo(({ params }: Props) => {
    const [payload, setPayload] = useState<TTransferPayload>({
        name: undefined,
        phone: '',
        sum: 0,
    })
    const [isOnConfirm, setIsOnConfirm] = useState(false)
    const resetDraft = TransferDraftStore.useReset()

    const handleTransfer = useCallback((payload: TTransferPayload) => {
        setPayload(payload)
        setIsOnConfirm(true)
    }, [])

    const handleGoBackFromConfirm = useCallback(() => {
        setIsOnConfirm(false)
    }, [])

    const styles = StyleSheet.create({
        infoList: {
            gap: SPACING.MD * SIZES.PX,
            marginTop: SPACING.SECTION * SIZES.PX,
        },
    })

    return (
        <>
            {isOnConfirm ? (
                <TransferBalanceConfirm
                    onGoBack={handleGoBackFromConfirm}
                    onSuccess={resetDraft}
                    name={payload.name}
                    phone={payload.phone}
                    sum={payload.sum}
                />
            ) : (
                <TransferBalanceForm
                    name={params.name}
                    phone={params.phone}
                    onTransfer={handleTransfer}
                />
            )}

            <View style={styles.infoList}>
                {TRANSFER_BALANCE_INFO_TEXTS.map((infoBlock) => (
                    <InfoCard
                        key={infoBlock.title}
                        title={infoBlock.title}
                        info={infoBlock.info}
                    />
                ))}
            </View>
        </>
    )
})
