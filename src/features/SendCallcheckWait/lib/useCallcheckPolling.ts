import { useEffect, useRef } from 'react'
import { IUser } from '../../../shared'
import { TCallcheckStatusResponse } from '../config/interfaces/ICallcheckStatusResponse'
import {
    ECallcheckErrorKind,
    parseCallcheckError,
} from './parseCallcheckError'

const DEFAULT_INTERVAL_MS = 2500

type Args = {
    enabled: boolean
    pollFn: () => Promise<TCallcheckStatusResponse>
    onSuccess: (user: IUser) => void
    onExpired: () => void
    onFatalError: (kind: ECallcheckErrorKind) => void
    intervalMs?: number
}

const isUserResponse = (resp: TCallcheckStatusResponse): resp is IUser =>
    typeof (resp as IUser).token === 'string'

export const useCallcheckPolling = ({
    enabled,
    pollFn,
    onSuccess,
    onExpired,
    onFatalError,
    intervalMs = DEFAULT_INTERVAL_MS,
}: Args) => {
    const inFlightRef = useRef(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const cancelledRef = useRef(false)

    const pollFnRef = useRef(pollFn)
    const onSuccessRef = useRef(onSuccess)
    const onExpiredRef = useRef(onExpired)
    const onFatalErrorRef = useRef(onFatalError)

    pollFnRef.current = pollFn
    onSuccessRef.current = onSuccess
    onExpiredRef.current = onExpired
    onFatalErrorRef.current = onFatalError

    useEffect(() => {
        if (!enabled) return

        cancelledRef.current = false
        inFlightRef.current = false

        const stop = () => {
            cancelledRef.current = true
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        const tick = async () => {
            if (inFlightRef.current || cancelledRef.current) return
            inFlightRef.current = true
            try {
                const resp = await pollFnRef.current()
                if (cancelledRef.current) return
                if (isUserResponse(resp)) {
                    stop()
                    onSuccessRef.current(resp)
                }
            } catch (error) {
                if (cancelledRef.current) return
                const kind = parseCallcheckError(error)
                if (
                    kind === ECallcheckErrorKind.Timeout ||
                    kind === ECallcheckErrorKind.SessionNotFound
                ) {
                    stop()
                    onExpiredRef.current()
                } else if (
                    kind === ECallcheckErrorKind.StatusUnavailable ||
                    kind === ECallcheckErrorKind.Network
                ) {
                    // silent retry on next tick
                } else {
                    stop()
                    onFatalErrorRef.current(kind)
                }
            } finally {
                inFlightRef.current = false
            }
        }

        intervalRef.current = setInterval(tick, intervalMs)
        tick()

        return stop
    }, [enabled, intervalMs])
}
