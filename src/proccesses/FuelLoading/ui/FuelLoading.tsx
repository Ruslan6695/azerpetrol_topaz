import { useFocusEffect } from 'expo-router'
import { memo, useCallback, useState } from 'react'
import {
    EFuellingErrorKind,
    IFuellingTotals,
    TFuelLoadingRoad,
    useGetBalance,
} from '../../../shared'
import { FuelLoadingEndWidget } from '../../../widgets/FuelLoading/FuelLoadingEndWidget'
import { FuelLoadingErrorWidget } from '../../../widgets/FuelLoading/FuelLoadingErrorWidget'
import { FuelLoadingFuellingWidget } from '../../../widgets/FuelLoading/FuelLoadingFuellingWidget'
import { FuelLoadingStartWidget } from '../../../widgets/FuelLoading/FuelLoadingStartWidget'

type Props = {}

export const FuelLoading = memo((props: Props) => {
    const [road, setRoad] = useState<TFuelLoadingRoad>('start')
    const [totals, setTotals] = useState<IFuellingTotals | null>(null)
    const [errorKind, setErrorKind] = useState<EFuellingErrorKind | null>(null)
    const { fetchBalance } = useGetBalance()

    const handleEndFuelling = useCallback((endTotals: IFuellingTotals) => {
        setTotals(endTotals)
        setRoad('end')
    }, [])

    const handleFuellingError = useCallback((kind: EFuellingErrorKind) => {
        setErrorKind(kind)
        setRoad('error')
    }, [])

    // Возврат на поллинг: колонка могла ожить, а сессия налива на бэкенде
    // жива — заново стартовать fuelling/start/ не нужно.
    const handleRetry = useCallback(() => {
        setErrorKind(null)
        setRoad('fuelling')
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchBalance({ args: undefined, hideToastOnError: true })
        }, [])
    )

    switch (road) {
        case 'start':
            return <FuelLoadingStartWidget setRoad={setRoad} />
        case 'fuelling':
            return (
                <FuelLoadingFuellingWidget
                    onEndFuelling={handleEndFuelling}
                    onError={handleFuellingError}
                />
            )
        case 'end':
            return totals ? <FuelLoadingEndWidget totals={totals} /> : null
        case 'error':
            return errorKind ? (
                <FuelLoadingErrorWidget
                    kind={errorKind}
                    onRetry={handleRetry}
                />
            ) : null
    }
})
