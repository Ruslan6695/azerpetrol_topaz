import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { PayBalanceWaitingGif } from '../../../../entities/PayBalanceWaitingGif'
import { ESCREENS, useSendFetch } from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { Typography } from '../../../../shared/Typography'
import { payBalanceWaitingApi } from '../api/payBalanceWaitingApi'
import { IPayBalanceWaitingData } from '../config/interfaces/IPayBalanceWaitingData'

type Props = {
    payId: number
    onGoBack: () => void
    backLink: ESCREENS | undefined
}

export const PayBalanceWaiting = memo(
    ({ payId, onGoBack, backLink }: Props) => {
        const router = useRouter()
        const intervalRef = useRef<any>(null)
        const { errorText, isSendFetchLoading, sendFetch } = useSendFetch<
            { pay_id: number },
            IPayBalanceWaitingData
        >({
            apiCallback: payBalanceWaitingApi.checkIsSuccess,
            errorText: `Ошибка при получении данных. Проверьте баланс, возможно деньги уже дошли. Если нет, обратитесь в поддержку.`,
        })
        const waitPay = useCallback((payId: number) => {
            intervalRef.current = setInterval(() => {
                sendFetch({
                    args: { pay_id: payId },
                    hideToastOnError: true,
                    leaveErrorBeforeLoading: true,
                    afterDataCallback(data) {
                        if (data.status) {
                            if (intervalRef) clearInterval(intervalRef.current)
                            router.navigate({
                                pathname: ESCREENS.SUCCESS,
                                params: {
                                    text: 'Оплата прошла успешно',
                                    link: backLink,
                                },
                            })
                        }
                    },
                })
            }, 1000)
        }, [])

        const goOnHomePage = useCallback(() => {
            router.navigate(ESCREENS.HOME)
        }, [])

        useEffect(() => {
            waitPay(payId)
            return function () {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                }
            }
        }, [payId])

        return (
            <View style={styles.container}>
                {errorText ? (
                    <>
                        <ErrorWhileFetchingForm
                            margins={{ mb: 30, mt: 30 }}
                            message={errorText}
                        />
                        <CustomButton
                            onPress={goOnHomePage}
                            styled={{
                                width: { type: 'px', value: 300 },
                                height: { type: 'px', value: 50 },
                                marginsPaddings: { mb: 15 },
                            }}
                        >
                            Вернуться на главную
                        </CustomButton>
                    </>
                ) : (
                    <>
                        <PayBalanceWaitingGif width={200} height={300} />
                        <Typography
                            type="bodyAccentMedium"
                            textAlign="center"
                            marginsPaddings={{ mt: -20 }}
                        >
                            НЕМНОГО ПОДОЖДИТЕ
                        </Typography>
                        <Typography
                            type="bodySmall"
                            marginsPaddings={{ mb: 30 }}
                            textAlign="center"
                        >
                            ДЕНЬГИ ПОСТУПЯТ АВТОМАТИЧЕСКИ
                        </Typography>
                        <CustomButton
                            onPress={onGoBack}
                            styled={{
                                width: { type: 'px', value: 300 },
                                marginsPaddings: { mb: 15 },
                            }}
                        >
                            Вернуться к выбору банков
                        </CustomButton>
                    </>
                )}

                <CustomButton
                    onPress={() => {}}
                    styled={{
                        type: 'secondary',
                        width: { type: 'px', value: 300 },
                    }}
                >
                    ПОМОЩЬ
                </CustomButton>
            </View>
        )
    }
)
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
