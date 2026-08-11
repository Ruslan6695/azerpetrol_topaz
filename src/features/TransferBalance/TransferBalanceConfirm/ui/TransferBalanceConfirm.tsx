import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    divideNumber,
    ESCREENS,
    SIZES,
    SPACING,
    UserStore,
    useFetchData,
    useSendFetch,
} from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { ListGroup, ListRow } from '../../../../shared/ListRow'
import { PillButton } from '../../../../shared/PillButton'
import { showError } from '../../../../shared/ToastComponent'
import { transferBalanceConfirmApi } from '../api/transferBalanceConfirmApi'
import { ITransferBalanceGetClientData } from '../config/interfaces/ITransferBalanceGetClientData'
import { TransferBalanceConfirmSkeleton } from './TransferBalanceConfirmSkeleton'

type Props = {
    name?: string
    phone: string
    sum: number
    onGoBack: () => void
    /** Черновик формы сбрасывает виджет — слайс формы отсюда недоступен */
    onSuccess: () => void
}

export const TransferBalanceConfirm = memo(
    ({ name, phone, sum, onGoBack, onSuccess }: Props) => {
        const setBalance = UserStore.useSetBalance()
        const balance = UserStore.useBalance()
        const router = useRouter()
        const { data, errorText, fetchData, isDataLoading } = useFetchData<
            ITransferBalanceGetClientData,
            { phone: string }
        >({
            apiCallback: transferBalanceConfirmApi.getClientInfo,
            errorText: 'Не удалось получить клиента',
        })
        const {
            isSendFetchLoading: isTransferLoading,
            sendFetch: sendTransfer,
        } = useSendFetch<{
            transferId: number
            sum: number
        }>({
            apiCallback: transferBalanceConfirmApi.confirm,
            errorText: 'Не удалось перевести средства',
        })

        const handleSubmit = useCallback(() => {
            if (data) {
                if (sum <= balance)
                    sendTransfer({
                        args: { transferId: data.id, sum },
                        afterDataCallback() {
                            onSuccess()
                            router.navigate({
                                pathname: ESCREENS.SUCCESS,
                                params: { text: 'Перевод успешно выполнен' },
                            })
                        },
                    })
                else {
                    showError({ text: 'Недостаточно средств' })
                }
            } else {
                showError({
                    text: 'Не удалось получить пользователя для перевода',
                })
            }
        }, [data, sum, balance, sendTransfer, onSuccess, router])

        const styles = StyleSheet.create({
            actions: {
                gap: SPACING.ROW_GAP * SIZES.PX,
                marginTop: SPACING.SCREEN * SIZES.PX,
            },
        })

        useEffect(() => {
            fetchData({
                args: { phone: phone },
                hideToastOnError: true,
                afterDataCallback(data) {
                    setBalance({
                        balance: data.balance,
                        bonus_balance: data.bonus_balance,
                    })
                },
            })
        }, [])

        if (errorText) {
            return (
                <CenteredState
                    variant="error"
                    title="Не удалось получить клиента"
                    description={errorText}
                    action={{ label: 'Вернуться назад', onPress: onGoBack }}
                />
            )
        }

        return (
            <>
                <ListGroup>
                    {isDataLoading ? (
                        <TransferBalanceConfirmSkeleton />
                    ) : (
                        <>
                            <ListRow
                                title="Получатель"
                                value={data?.name ?? name ?? ''}
                            />
                            <ListRow title="Телефон" value={phone} />
                            <ListRow
                                title="Сумма"
                                value={`${divideNumber(+sum.toFixed(2))} ₽`}
                            />
                            <ListRow
                                last
                                title="Остаток средств"
                                value={`${divideNumber(
                                    +(balance - sum).toFixed(2)
                                )} ₽`}
                            />
                        </>
                    )}
                </ListGroup>

                {!isDataLoading && (
                    <View style={styles.actions}>
                        <PillButton
                            title="Перевести"
                            onPress={handleSubmit}
                            loading={isTransferLoading}
                        />
                        <PillButton
                            title="Вернуться назад"
                            variant="secondary"
                            onPress={onGoBack}
                        />
                    </View>
                )}
            </>
        )
    }
)
