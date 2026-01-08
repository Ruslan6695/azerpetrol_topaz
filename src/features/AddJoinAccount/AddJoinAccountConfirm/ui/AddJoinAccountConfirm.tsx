import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { TransferBalanceConfirmInfoItem } from '../../../../entities/TransferBalanceConfirmInfoItem'
import {
    ESCREENS,
    SIZES,
    ThemeStore,
    useFetchData,
    useSendFetch,
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { Loader } from '../../../../shared/Loader'
import { showError, showToast } from '../../../../shared/ToastComponent'
import { addJoinAccountConfirmApi } from '../api/addJoinAccountConfirmApi'
import { IAddJoinAccountGetAccountInfoData } from '../config/IAddJoinAccountGetAccountInfoData'
import { AddJoinAccountConfirmSkeleton } from './AddJoinAccountConfirmSkeleton'

type Props = {
    name?: string
    phone: string
    onGoBack: () => void
}

export const AddJoinAccountConfirm = ({ onGoBack, phone, name }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const [userName, setUserName] = useState(name || '')
    const router = useRouter()
    const { data, errorText, fetchData, isDataLoading } = useFetchData<
        IAddJoinAccountGetAccountInfoData,
        { phone: string }
    >({
        apiCallback: addJoinAccountConfirmApi.getAccountInfo,
        errorText: 'Не удалось получить клиента',
    })
    const {
        errorText: transferErorrtext,
        isSendFetchLoading: isTransferLoading,
        sendFetch: sendTransfer,
    } = useSendFetch<{
        accountId: number
    }>({
        apiCallback: addJoinAccountConfirmApi.confirm,
        errorText: 'Не удалось перевести средства',
    })

    const handleSubmit = useCallback(() => {
        if (data) {
            sendTransfer({
                args: { accountId: data?.account.id },
                afterDataCallback(data) {
                    showToast({
                        text: 'Приглашение для привязки пользователя отправлено',
                        type: 'success',
                    })
                    router.navigate(ESCREENS.PROFILE)
                },
            })
        } else {
            showError({
                text: 'Не удалось получить аккаунт для привязки',
            })
        }
    }, [data])

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    backgroundColor: COLORS.BACKGROUND.Tertiary,
                    padding: SIZES.PX * 20,
                    borderRadius: 16 * SIZES.PX,
                },
            }),
        [COLORS]
    )

    useEffect(() => {
        fetchData({
            args: { phone: phone },
            hideToastOnError: true,
            afterDataCallback(data) {
                setUserName(data.account.name)
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
                            type: 'secondary',
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
                            <AddJoinAccountConfirmSkeleton />
                        ) : (
                            <>
                                <TransferBalanceConfirmInfoItem
                                    title="Пользователь"
                                    info={userName}
                                />
                                <TransferBalanceConfirmInfoItem
                                    title="Телефон"
                                    info={phone}
                                />
                            </>
                        )}
                    </View>
                    {isTransferLoading ? (
                        <Loader marginsPaddings={{ mt: 20 }} />
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
                                Пригласить
                            </CustomButton>
                            <CustomButton
                                onPress={onGoBack}
                                styled={{
                                    type: 'secondary',
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
