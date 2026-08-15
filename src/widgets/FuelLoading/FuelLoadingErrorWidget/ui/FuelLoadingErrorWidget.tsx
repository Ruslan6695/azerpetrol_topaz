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
    /** Вернуться к опросу статуса — колонка могла ожить */
    onRetry: () => void
}

// Экрана ошибки налива в макете нет — дорисован: на статусах error/locked
// и по таймауту пользователь иначе остаётся на вечно крутящемся кольце.
export const FuelLoadingErrorWidget = memo(({ kind, onRetry }: Props) => {
    const router = useRouter()
    const clearState = FuelStore.useClearState()
    const { title, description } = getFuellingErrorText(kind)

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
                    action={{ label: 'Проверить ещё раз', onPress: onRetry }}
                    secondaryAction={{
                        label: 'Вернуться к выбору',
                        onPress: handleBackToFuel,
                    }}
                />
            </View>
        </>
    )
})
