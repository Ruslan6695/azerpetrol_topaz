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
import { EFuelLoadingFuellingStatuses } from '../config/enums/EFuelLoadingFuellingStatuses'
import { useFuellingPolling } from '../lib/useFuellingPolling'

type Props = {
    onEndFuelling: (totals: IFuellingTotals) => void
    onError: (kind: EFuellingErrorKind) => void
}

export const FuelLoadingFuellingWidget = memo(
    ({ onEndFuelling, onError }: Props) => {
        const router = useRouter()
        const { azs, column, trkType, liters } = FuelStore.useState()

        // Хук вызывается до любых return, чтобы не ронять порядок хуков,
        // а от опроса колонки с пустыми параметрами защищает enabled.
        const { status, volume } = useFuellingPolling({
            enabled: Boolean(azs && column),
            azsId: azs?.id ?? 0,
            columnDevice: column?.device ?? '',
            onComplete: onEndFuelling,
            onError,
        })

        // Возврат на выбор литров: роут /fuel остался в стеке под наливом
        // и держит свой шаг, поэтому router.back() — тот же выход,
        // что «Отмена» на шаге запуска. Сессию на колонке уход не отменяет:
        // эндпоинта отмены нет, есть только fuelling/start/ и fuelling/status/.
        const handleGoBack = useCallback(() => {
            router.back()
        }, [router])

        if (!azs || !column || !trkType || !liters) return null

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
                    details={`Колонка ${column.name} · ${trkType.name} · не отходите от авто`}
                    alarming={status === EFuelLoadingFuellingStatuses.HALTED}
                />
            </>
        )
    }
)
