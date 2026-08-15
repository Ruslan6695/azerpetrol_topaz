import { memo, useEffect } from 'react'
import { BackHandler } from 'react-native'
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

        // Уйти с экрана во время налива нельзя: сессия на колонке уже открыта,
        // а вернуться в неё приложению неоткуда.
        useEffect(() => {
            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                () => true
            )
            return () => subscription.remove()
        }, [])

        if (!azs || !column || !trkType || !liters) return null

        const statusText = status
            ? (FUELLING_STATUS_TEXTS[status] ?? FUELLING_STATUS_PENDING_TEXT)
            : FUELLING_STATUS_PENDING_TEXT

        return (
            <>
                <StepHeader title="Идёт налив" />
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
