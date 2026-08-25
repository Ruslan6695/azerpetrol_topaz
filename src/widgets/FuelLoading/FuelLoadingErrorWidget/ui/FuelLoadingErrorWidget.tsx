import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    EFuellingErrorKind,
    ESCREENS,
    FuelStore,
    getFuellingErrorText,
    SIZES,
} from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'

type Props = {
    kind: EFuellingErrorKind
    reason?: string
    /** Повторить опрос — только для TIMEOUT, где статус колонки не выяснен */
    onRetry: () => void
}

// Экрана ошибки налива в макете нет — дорисован. TIMEOUT — единственная
// причина, где статус колонки действительно неизвестен и есть смысл
// проверить ещё раз; Expired/StationCanceled/UserCanceled — терминальные
// статусы заказа Топаз, повтор опроса того же orderId вернёт тот же статус.
export const FuelLoadingErrorWidget = memo(({ kind, reason, onRetry }: Props) => {
    const router = useRouter()
    const clearState = FuelStore.useClearState()
    const { title, description } = getFuellingErrorText(kind, reason)
    const isRetryable = kind === EFuellingErrorKind.TIMEOUT

    const handleBackToFuel = useCallback(() => {
        clearState()
        router.navigate(ESCREENS.FUEL)
    }, [clearState, router])

    const styles = StyleSheet.create({
        container: {
            minHeight: SIZES.HEIGHT(0.7),
        },
    })

    return (
        <>
            <StepHeader title="Налив прерван" />
            <View style={styles.container}>
                <CenteredState
                    variant="error"
                    title={title}
                    description={description}
                    action={
                        isRetryable
                            ? { label: 'Проверить ещё раз', onPress: onRetry }
                            : { label: 'Вернуться к выбору', onPress: handleBackToFuel }
                    }
                    secondaryAction={
                        isRetryable
                            ? { label: 'Вернуться к выбору', onPress: handleBackToFuel }
                            : undefined
                    }
                />
            </View>
        </>
    )
})
