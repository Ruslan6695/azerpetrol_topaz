import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { TransferBalanceConfirmInfoItem } from '../../../../entities/TransferBalanceConfirmInfoItem'
import {
    COLORS,
    ESCREENS,
    SIZES,
    UserStore,
    divideNumber,
    useFetchData,
    useSendFetch,
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { Loader } from '../../../../shared/Loader'
import { showError } from '../../../../shared/ToastComponent'
import { transferBalanceConfirmApi } from '../api/transferBalanceConfirmApi'
import { ITransferBalanceGetClientData } from '../config/interfaces/ITransferBalanceGetClientData'
import { TransferBalanceConfirmSkeleton } from './TransferBalanceConfirmSkeleton'

type Props = {
    name?: string
    phone: string
    sum: number
    onGoBack: () => void
}

export const TransferBalanceConfirm = memo(
    ({ name, phone, sum, onGoBack }: Props) => {
        const setBalance = UserStore.useSetBalance()
        const balance = UserStore.useBalance()
        const [userName, setUserName] = useState(name || '')
        const router = useRouter()
        const { data, errorText, fetchData, isDataLoading } = useFetchData<
            ITransferBalanceGetClientData,
            { phone: string }
        >({
            apiCallback: transferBalanceConfirmApi.getClientInfo,
            errorText: 'Не удалось получить клиента',
        })
        const {
            errorText: transferErorrtext,
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
                        args: { transferId: data?.id, sum },
                        afterDataCallback(data) {
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
        }, [data])

        useEffect(() => {
            fetchData({
                args: { phone: phone },
                hideToastOnError: true,
                afterDataCallback(data) {
                    setUserName(data.name)
                    setBalance({ balance: data.balance })
                },
            })
        }, [])

        return (
            <>
                {errorText ? (
                    <>
                        <ErrorWhileFetchingForm
                            margins={{ mb: 20 }}
                            message={errorText}
                        />
                        <CustomButton
                            onPress={onGoBack}
                            styled={{
                                type: 'OUTLINED',
                                width: {
                                    value: '100%',
                                    type: 'absolute',
                                },

                                marginsPaddings: { mt: 10 },
                            }}
                        >
                            Вернуться назад
                        </CustomButton>
                    </>
                ) : (
                    <>
                        <View style={styles.container}>
                            {isDataLoading ? (
                                <TransferBalanceConfirmSkeleton />
                            ) : (
                                <>
                                    <TransferBalanceConfirmInfoItem
                                        title="Получатель"
                                        info={userName}
                                    />
                                    <TransferBalanceConfirmInfoItem
                                        title="Телефон"
                                        info={phone}
                                    />
                                    <TransferBalanceConfirmInfoItem
                                        title="Сумма"
                                        info={`${divideNumber(sum)} ₽`}
                                    />
                                    <TransferBalanceConfirmInfoItem
                                        title="Остаток средств"
                                        info={`${divideNumber(
                                            balance - sum
                                        )} ₽`}
                                    />
                                </>
                            )}
                        </View>
                        {isTransferLoading ? (
                            <Loader />
                        ) : isDataLoading ? (
                            <></>
                        ) : (
                            <>
                                <CustomButton
                                    disabled={isTransferLoading}
                                    onPress={handleSubmit}
                                    styled={{
                                        width: {
                                            value: '100%',
                                            type: 'absolute',
                                        },
                                        marginsPaddings: { mt: 20 },
                                    }}
                                >
                                    ПОДТВЕРДИТЬ ПЕРЕВОД
                                </CustomButton>
                                <CustomButton
                                    onPress={onGoBack}
                                    styled={{
                                        type: 'OUTLINED',
                                        width: {
                                            value: '100%',
                                            type: 'absolute',
                                        },

                                        marginsPaddings: { mt: 10 },
                                    }}
                                >
                                    Вернуться назад
                                </CustomButton>
                            </>
                        )}
                    </>
                )}
            </>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.GRAY_3,
        padding: SIZES.PX * 20,
        borderRadius: 10 * SIZES.PX,
    },
})
