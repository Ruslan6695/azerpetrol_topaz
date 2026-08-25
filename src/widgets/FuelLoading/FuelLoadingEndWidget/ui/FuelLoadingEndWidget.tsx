import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { FuelLoadingResultHeader } from '../../../../entities/FuelLoading/FuelLoadingResultHeader'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    divideNumber,
    ESCREENS,
    FuelStore,
    IFuellingTotals,
    SIZES,
    SPACING,
    useGetBalance,
} from '../../../../shared'
import { ListGroup, ListRow } from '../../../../shared/ListRow'
import { PillButton } from '../../../../shared/PillButton'

type Props = {
    totals: IFuellingTotals
}

// Итоги налива (dc.html:585–599). Экран не центрированный — обычная колонка.
export const FuelLoadingEndWidget = memo(({ totals }: Props) => {
    const router = useRouter()
    const { azs, column, fuelOption } = FuelStore.useState()
    const clearState = FuelStore.useClearState()
    const { balance, fetchBalance } = useGetBalance()

    // Баланс в сторе остался догрузочным: списание произошло уже после
    // того, как процесс подтянул его на фокусе.
    useEffect(() => {
        fetchBalance({ args: undefined, hideToastOnError: true })
    }, [])

    const handleGoHome = useCallback(() => {
        clearState()
        router.navigate(ESCREENS.HOME)
    }, [clearState, router])

    const styles = StyleSheet.create({
        section: {
            marginTop: SPACING.LG * SIZES.PX,
        },
    })

    return (
        <>
            <StepHeader title="Итоги налива" />
            <FuelLoadingResultHeader title="Налив завершён" />

            <View style={styles.section}>
                <ListGroup level="secondary">
                    <ListRow title="АЗС" value={azs?.name ?? '—'} />
                    <ListRow
                        title="Топливо"
                        value={
                            fuelOption && column
                                ? `${fuelOption.name} · Колонка ${column.id}`
                                : '—'
                        }
                    />
                    <ListRow
                        title="Литры"
                        value={`${totals.volume.toFixed(1)} л`}
                    />
                    <ListRow
                        title="Списано"
                        value={`${divideNumber(+totals.sum.toFixed(2))} ₽`}
                        valueAccent
                    />
                    <ListRow
                        title="Остаток на балансе"
                        value={`${divideNumber(balance)} ₽`}
                        last
                    />
                </ListGroup>
            </View>

            <View style={styles.section}>
                <PillButton
                    title="На главную"
                    variant="elevated"
                    onPress={handleGoHome}
                />
            </View>
        </>
    )
})
