import { memo, useCallback, useEffect, useRef } from 'react'
import { PayBalanceWaitingGif } from '../../../../entities/PayBalanceWaitingGif'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { CustomButton } from '../../../../shared/CustomButton'
import { ESCREENS, SIZES, useSendFetch } from '../../../../shared'
import { showError } from '../../../../shared/ToastComponent'
import { payBalanceWaitingApi } from '../api/payBalanceWaitingApi'
import { IPayBalanceWaitingData } from '../config/interfaces/IPayBalanceWaitingData'
import { useRouter } from 'expo-router'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'

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
                                type: 'OUTLINED',
                                fz: 16,
                                width: { type: 'px', value: 300 },
                                height: { type: 'px', value: 50 },
                                marginsPaddings: { mb: 15 },
                            }}
                        >
                            ВЕРНУТЬСЯ НА ГЛАВНУЮ
                        </CustomButton>
                    </>
                ) : (
                    <>
                        <PayBalanceWaitingGif width={300} height={300} />
                        <CustomText
                            fw="600"
                            fz={25}
                            textAlign="center"
                            marginsPaddings={{ mt: -20 }}
                        >
                            НЕМНОГО ПОДОЖДИТЕ
                        </CustomText>
                        <CustomText
                            marginsPaddings={{ mb: 30 }}
                            fz={18}
                            textAlign="center"
                        >
                            ДЕНЬГИ ПОСТУПЯТ АВТОМАТИЧЕСКИ
                        </CustomText>
                        <CustomButton
                            onPress={onGoBack}
                            styled={{
                                type: 'OUTLINED',
                                fz: 16,
                                width: { type: 'px', value: 300 },
                                height: { type: 'px', value: 50 },
                                marginsPaddings: { mb: 15 },
                            }}
                        >
                            ВЕРНУТЬСЯ К ВЫБОРУ БАНКА
                        </CustomButton>
                    </>
                )}

                <CustomButton
                    onPress={() => {}}
                    styled={{
                        type: 'DARK',
                        fz: 20,
                        width: { type: 'px', value: 300 },
                        height: { type: 'px', value: 50 },
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
