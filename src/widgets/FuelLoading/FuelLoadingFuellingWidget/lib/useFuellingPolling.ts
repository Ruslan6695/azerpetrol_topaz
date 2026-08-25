import { useEffect, useRef, useState } from 'react'
import {
    EFuellingErrorKind,
    IFuellingTotals,
    useFetchData,
} from '../../../../shared'
import { fuelLoadingFuellingApi } from '../api/fuelLoadingFuellingApi'
import { EFuelOrderStatus } from '../config/enums/EFuelOrderStatus'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
import { IFuelLoadingFuellingData } from '../config/interfaces/IFuelLoadingFuellingData'

const INTERVAL_MS = 1000
// Живой налив бака укладывается в пару минут; десять — это уже «колонка
// не отвечает», иначе экран крутится бесконечно.
const DEADLINE_MS = 10 * 60 * 1000

type Args = {
    /** Пока orderId не создан, опрашивать нечего */
    enabled: boolean
    orderId: string
    onComplete: (totals: IFuellingTotals) => void
    onError: (kind: EFuellingErrorKind, reason?: string) => void
}

// Поллинг статуса заказа. Живёт в lib, а не в компоненте: своих setInterval
// по месту в проекте не заводим (см. useCallcheckPolling). Запрос идёт через
// useFetchData, поэтому разлогин по 401 остаётся централизованным.
export const useFuellingPolling = ({
    enabled,
    orderId,
    onComplete,
    onError,
}: Args) => {
    const [status, setStatus] = useState<EFuelOrderStatus | null>(null)
    const [volume, setVolume] = useState(0)

    const { fetchData } = useFetchData<
        IFuelLoadingFuellingData,
        IFuelLoadingFuellingArgs
    >({
        apiCallback: fuelLoadingFuellingApi.getStatus,
        errorText: 'Не удалось получить статус налива',
    })

    const inFlightRef = useRef(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const cancelledRef = useRef(false)

    const fetchDataRef = useRef(fetchData)
    const onCompleteRef = useRef(onComplete)
    const onErrorRef = useRef(onError)
    fetchDataRef.current = fetchData
    onCompleteRef.current = onComplete
    onErrorRef.current = onError

    useEffect(() => {
        if (!enabled) return

        cancelledRef.current = false
        inFlightRef.current = false
        const startedAt = Date.now()

        const stop = () => {
            cancelledRef.current = true
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        const tick = async () => {
            if (inFlightRef.current || cancelledRef.current) return

            if (Date.now() - startedAt > DEADLINE_MS) {
                stop()
                onErrorRef.current(EFuellingErrorKind.TIMEOUT)
                return
            }

            inFlightRef.current = true
            await fetchDataRef.current({
                args: { orderId },
                hideToastOnError: true,
                disableSetLoading: true,
                afterDataCallback(data) {
                    if (cancelledRef.current) return
                    if (!data?.status) return

                    setStatus(data.status)
                    setVolume(data.volume)

                    switch (data.status) {
                        case EFuelOrderStatus.COMPLETED:
                            stop()
                            onCompleteRef.current({
                                volume: data.volume,
                                sum: data.sum,
                            })
                            break
                        case EFuelOrderStatus.EXPIRED:
                            stop()
                            onErrorRef.current(
                                EFuellingErrorKind.EXPIRED,
                                data.reason
                            )
                            break
                        case EFuelOrderStatus.STATION_CANCELED:
                            stop()
                            onErrorRef.current(
                                EFuellingErrorKind.STATION_CANCELED,
                                data.reason
                            )
                            break
                        case EFuelOrderStatus.USER_CANCELED:
                            stop()
                            onErrorRef.current(
                                EFuellingErrorKind.USER_CANCELED,
                                data.reason
                            )
                            break
                    }
                },
                finalyCallback() {
                    inFlightRef.current = false
                },
            })
        }

        intervalRef.current = setInterval(tick, INTERVAL_MS)
        tick()

        return stop
    }, [enabled, orderId])

    return { status, volume }
}
