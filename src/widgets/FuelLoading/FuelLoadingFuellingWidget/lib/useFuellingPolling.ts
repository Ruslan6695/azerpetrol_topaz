import { useEffect, useRef, useState } from 'react'
import {
    EFuellingErrorKind,
    IFuellingTotals,
    useFetchData,
} from '../../../../shared'
import { fuelLoadingFuellingApi } from '../api/fuelLoadingFuellingApi'
import { EFuelLoadingFuellingStatuses } from '../config/enums/EFuelLoadingFuellingStatuses'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
import { IFuelLoadingFuellingData } from '../config/interfaces/IFuelLoadingFuellingData'

const INTERVAL_MS = 1000
// Живой налив бака укладывается в пару минут; десять — это уже «колонка
// не отвечает», иначе экран крутится бесконечно.
const DEADLINE_MS = 10 * 60 * 1000

type Args = {
    /** Пока параметры налива не собраны, опрашивать колонку нечем */
    enabled: boolean
    azsId: number
    columnDevice: string
    onComplete: (totals: IFuellingTotals) => void
    onError: (kind: EFuellingErrorKind) => void
}

// Поллинг статуса колонки. Живёт в lib, а не в компоненте: своих setInterval
// по месту в проекте не заводим (см. useCallcheckPolling). Запрос идёт через
// useFetchData, поэтому разлогин по 401 остаётся централизованным.
export const useFuellingPolling = ({
    enabled,
    azsId,
    columnDevice,
    onComplete,
    onError,
}: Args) => {
    const [status, setStatus] = useState<EFuelLoadingFuellingStatuses | null>(
        null
    )
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

    // «Налив точно шёл» — без этого флага idle до начала налива приняли бы
    // за его завершение. Взводится и по ненулевому объёму: короткий налив
    // может целиком уместиться между двумя тиками, и статус fuelling
    // не поймает ни один опрос.
    const hasStartedRef = useRef(false)
    // Последние ненулевые показания. К моменту idle колонка уже могла
    // обнулить счётчик, а итоги показать надо настоящие.
    const lastTotalsRef = useRef<IFuellingTotals | null>(null)

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
        hasStartedRef.current = false
        lastTotalsRef.current = null
        const startedAt = Date.now()

        const stop = () => {
            cancelledRef.current = true
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        const tick = async () => {
            // Ответ колонки может прийти позже следующего тика — без флага
            // запросы копились бы параллельно.
            if (inFlightRef.current || cancelledRef.current) return

            if (Date.now() - startedAt > DEADLINE_MS) {
                stop()
                onErrorRef.current(EFuellingErrorKind.TIMEOUT)
                return
            }

            inFlightRef.current = true
            await fetchDataRef.current({
                args: { azsId, columnDevice },
                // Тост на каждый неудачный опрос завалил бы экран,
                // а свой индикатор загрузки здесь не нужен — кольцо само им и является.
                hideToastOnError: true,
                disableSetLoading: true,
                afterDataCallback(data) {
                    if (cancelledRef.current) return

                    // Потеряв связь с контроллером, бэкенд отдаёт 200 с пустым
                    // телом. Затирать им последний осмысленный статус нельзя.
                    if (!data?.status) return

                    setStatus(data.status)
                    setVolume(data.volume)

                    if (
                        data.status === EFuelLoadingFuellingStatuses.FUELLING ||
                        data.volume > 0
                    ) {
                        hasStartedRef.current = true
                    }

                    if (data.volume > 0) {
                        lastTotalsRef.current = {
                            volume: data.volume,
                            sum: data.volume * data.price,
                        }
                    }

                    const complete = () => {
                        stop()
                        onCompleteRef.current(
                            lastTotalsRef.current ?? {
                                volume: data.volume,
                                sum: data.volume * data.price,
                            }
                        )
                    }

                    switch (data.status) {
                        case EFuelLoadingFuellingStatuses.COMPLETE:
                            complete()
                            break
                        // Заказ отработан, но статус complete держится только
                        // до возврата пистолета и легко проскакивает между
                        // тиками. Повесили рукав — колонка ушла в idle,
                        // и это тоже конец налива.
                        case EFuelLoadingFuellingStatuses.IDLE:
                            if (hasStartedRef.current) complete()
                            break
                        case EFuelLoadingFuellingStatuses.ERROR:
                            stop()
                            onErrorRef.current(EFuellingErrorKind.PUMP_ERROR)
                            break
                        case EFuelLoadingFuellingStatuses.LOCKED:
                            stop()
                            onErrorRef.current(EFuellingErrorKind.LOCKED)
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
    }, [enabled, azsId, columnDevice])

    return { status, volume }
}
