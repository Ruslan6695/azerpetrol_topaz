import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { FuelPouringProgress } from '../../../../entities/FuelLoading/FuelPouringProgress'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    EFuellingErrorKind,
    FuelStore,
    IFuellingTotals,
} from '../../../../shared'
import {
    FUELLING_STATUS_PENDING_TEXT,
    FUELLING_STATUS_TEXTS,
} from '../config/constants/FUELLING_STATUS_TEXTS'
import { useFuellingPolling } from '../lib/useFuellingPolling'

type Props = {
    onEndFuelling: (totals: IFuellingTotals) => void
    onError: (kind: EFuellingErrorKind, reason?: string) => void
}

export const FuelLoadingFuellingWidget = memo(
    ({ onEndFuelling, onError }: Props) => {
        const router = useRouter()
        const { azs, column, fuelOption, liters, orderId } =
            FuelStore.useState()

        const { status, volume } = useFuellingPolling({
            enabled: Boolean(orderId),
            orderId: orderId ?? '',
            onComplete: onEndFuelling,
            onError,
        })

        const handleGoBack = useCallback(() => {
            router.back()
        }, [router])

        if (!azs || !column || !fuelOption || !liters || !orderId) return null

        const statusText = status
            ? (FUELLING_STATUS_TEXTS[status] ?? FUELLING_STATUS_PENDING_TEXT)
            : FUELLING_STATUS_PENDING_TEXT

        return (
            <>
                <StepHeader title="Идёт налив" onBack={handleGoBack} />
                <FuelPouringProgress
                    volume={volume}
                    target={liters}
                    statusText={statusText}
                    details={`Колонка ${column.id} · ${fuelOption.name} · не отходите от авто`}
                />
            </>
        )
    }
)
