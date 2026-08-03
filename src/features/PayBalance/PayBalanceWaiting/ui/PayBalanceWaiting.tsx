import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { ESCREENS, SIZES, useSendFetch } from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { Loader } from '../../../../shared/Loader'
import { payBalanceWaitingApi } from '../api/payBalanceWaitingApi'
import { IPayBalanceWaitingData } from '../config/interfaces/IPayBalanceWaitingData'

// CenteredState растягивается по flex, а экран пополнения скроллится —
// без минимальной высоты состояние схлопнулось бы по контенту у шапки.
const styles = StyleSheet.create({
    container: {
        minHeight: SIZES.HEIGHT(0.65),
    },
})

type Props = {
    payId: number
    onGoBack: () => void
    backLink: ESCREENS | undefined
}

export const PayBalanceWaiting = memo(
    ({ payId, onGoBack, backLink }: Props) => {
        const router = useRouter()
        const intervalRef = useRef<any>(null)
        const { errorText, sendFetch } = useSendFetch<
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
                            // text не передаём — на экране успеха
                            // подставится текст пополнения из макета
                            router.navigate({
                                pathname: ESCREENS.SUCCESS,
                                params: { link: backLink },
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

        if (errorText) {
            return (
                <View style={styles.container}>
                    <CenteredState
                        variant="error"
                        title="Не удалось проверить оплату"
                        description={errorText}
                        action={{ label: 'На главную', onPress: goOnHomePage }}
                    />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <CenteredState
                    title="Ожидаем оплату"
                    description="Подтвердите платёж в приложении банка — средства поступят автоматически."
                    icon={<Loader />}
                    action={{
                        label: 'Вернуться к выбору банка',
                        onPress: onGoBack,
                    }}
                />
            </View>
        )
    }
)
