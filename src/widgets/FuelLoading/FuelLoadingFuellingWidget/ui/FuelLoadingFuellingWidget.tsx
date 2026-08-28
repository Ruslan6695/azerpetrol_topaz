import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { FuelPouringProgress } from '../../../../entities/FuelLoading/FuelPouringProgress'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    EFuellingErrorKind,
    FuelStore,
    IFuellingTotals,
    useSendFetch,
} from '../../../../shared'
import { fuelLoadingFuellingApi } from '../api/fuelLoadingFuellingApi'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
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

        // До этого «Назад» просто закрывал экран, не сообщая ни серверу, ни
        // Топаз об отмене — заказ оставался висеть в нетерминальном статусе
        // и блокировал следующий налив. Шлём отмену, но не ждём ответа —
        // пользователь уходит с экрана сразу, ошибка отправки некритична
        // (заказ подчистит серверный cron по таймауту).
        const { sendFetch } = useSendFetch<IFuelLoadingFuellingArgs>({
            apiCallback: fuelLoadingFuellingApi.cancel,
            errorText: 'Ошибка при отмене налива',
        })

        const handleGoBack = useCallback(() => {
            if (orderId) {
                sendFetch({ args: { orderId }, hideToastOnError: true })
            }
            router.back()
        }, [orderId, sendFetch, router])

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
