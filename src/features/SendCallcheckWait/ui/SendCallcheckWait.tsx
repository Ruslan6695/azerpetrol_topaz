import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { CenteredState } from '../../../shared/CenteredState'
import { Icon } from '../../../shared/Icons'
import { Loader } from '../../../shared/Loader'
import { PillButton } from '../../../shared/PillButton'
import { Typography } from '../../../shared/Typography'
import { showError } from '../../../shared/ToastComponent'
import {
    EAuthMethod,
    IUser,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../shared'
import { callcheckApi } from '../api/callcheckApi'
import { TCallcheckStatusResponse } from '../config/interfaces/ICallcheckStatusResponse'
import {
    ECallcheckErrorKind,
    getCallcheckErrorText,
    parseCallcheckError,
} from '../lib/parseCallcheckError'
import { useCallcheckPolling } from '../lib/useCallcheckPolling'

const TOTAL_TIMEOUT_SEC = 300
const FALLBACK_UNLOCK_SEC = 60

type InitData = {
    check_id: string
    call_phone: string
    call_phone_pretty: string
}

type Props = {
    mode: 'login' | 'registration'
    phone: string
    captchaToken?: string
    name?: string
    surname?: string
    fallbackMethod?: EAuthMethod
    onSuccess: (user: IUser) => void
    onFallback: (method: EAuthMethod) => void
    onCancel: () => void
    onRetry: () => void
}

const fallbackLabel = (method?: EAuthMethod): string => {
    if (method === EAuthMethod.Sms) return 'Отправить смс-код'
    if (method === EAuthMethod.Call) return 'Получить звонок с кодом'
    return 'Другой способ'
}

export const SendCallcheckWait = memo(
    ({
        mode,
        phone,
        captchaToken,
        name,
        surname,
        fallbackMethod,
        onSuccess,
        onFallback,
        onCancel,
        onRetry,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const [initData, setInitData] = useState<InitData | null>(null)
        const [status, setStatus] = useState<
            'initiating' | 'waiting' | 'expired' | 'initError'
        >('initiating')
        const [elapsedSec, setElapsedSec] = useState(0)
        const mountedRef = useRef(true)

        useEffect(() => {
            mountedRef.current = true
            return () => {
                mountedRef.current = false
            }
        }, [])

        const initiate = useCallback(async () => {
            setStatus('initiating')
            setElapsedSec(0)
            setInitData(null)
            try {
                const resp =
                    mode === 'login'
                        ? await callcheckApi.initLogin({
                              phone,
                              captchaToken,
                          })
                        : await callcheckApi.initRegistration({
                              phone,
                              name: name || '',
                              surname: surname || '',
                              captchaToken,
                          })
                if (!mountedRef.current) return
                setInitData({
                    check_id: resp.check_id,
                    call_phone: resp.call_phone,
                    call_phone_pretty: resp.call_phone_pretty,
                })
                setStatus('waiting')
            } catch (error) {
                if (!mountedRef.current) return
                const kind = parseCallcheckError(error)
                showError({ text: getCallcheckErrorText(kind) })
                if (
                    kind === ECallcheckErrorKind.CaptchaFailed ||
                    kind === ECallcheckErrorKind.UserNotFound ||
                    kind === ECallcheckErrorKind.UserExists ||
                    kind === ECallcheckErrorKind.MissingFields ||
                    kind === ECallcheckErrorKind.NoData
                ) {
                    onCancel()
                } else {
                    setStatus('initError')
                }
            }
        }, [mode, phone, captchaToken, name, surname, onCancel])

        useEffect(() => {
            initiate()
            // initiate runs once on mount; retries are explicit
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        useEffect(() => {
            if (status !== 'waiting') return
            const id = setInterval(() => {
                setElapsedSec((prev) => {
                    if (prev + 1 >= TOTAL_TIMEOUT_SEC) {
                        clearInterval(id)
                        setStatus('expired')
                        return TOTAL_TIMEOUT_SEC
                    }
                    return prev + 1
                })
            }, 1000)
            return () => clearInterval(id)
        }, [status])

        const pollFn = useCallback((): Promise<TCallcheckStatusResponse> => {
            if (!initData) return Promise.reject(new Error('no init data'))
            return mode === 'login'
                ? callcheckApi.pollLoginStatus({
                      phone,
                      checkId: initData.check_id,
                  })
                : callcheckApi.pollRegistrationStatus({
                      phone,
                      checkId: initData.check_id,
                  })
        }, [initData, mode, phone])

        const handlePollSuccess = useCallback(
            (user: IUser) => {
                onSuccess(user)
            },
            [onSuccess]
        )

        const handlePollExpired = useCallback(() => {
            setStatus('expired')
        }, [])

        const handlePollFatal = useCallback((kind: ECallcheckErrorKind) => {
            showError({ text: getCallcheckErrorText(kind) })
            setStatus('expired')
        }, [])

        useCallcheckPolling({
            enabled: status === 'waiting' && initData !== null,
            pollFn,
            onSuccess: handlePollSuccess,
            onExpired: handlePollExpired,
            onFatalError: handlePollFatal,
        })

        const handleCall = useCallback(() => {
            if (!initData) return
            Linking.openURL(`tel:${initData.call_phone}`).catch(() => {
                showError({ text: 'Не удалось открыть звонок' })
            })
        }, [initData])

        const handleFallback = useCallback(() => {
            if (!fallbackMethod) return
            onFallback(fallbackMethod)
        }, [fallbackMethod, onFallback])

        const styles = StyleSheet.create({
            // Фиксированная высота, чтобы шит не схлопывался на время инициации
            initiating: {
                minHeight: 220 * SIZES.PX,
                alignItems: 'center',
                justifyContent: 'center',
            },
            waiting: {
                alignItems: 'center',
                gap: SPACING.SM * SIZES.PX,
                paddingBottom: SPACING.SM * SIZES.PX,
            },
            circle: {
                width: 96 * SIZES.PX,
                height: 96 * SIZES.PX,
                borderRadius: RADII.PILL,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.GLASS.Secondary,
                borderWidth: 1,
                borderColor: COLORS.GLASS.Border,
                marginBottom: SPACING.SM * SIZES.PX,
            },
            hint: {
                maxWidth: 260 * SIZES.PX,
            },
        })

        if (status === 'initiating') {
            return (
                <View style={styles.initiating}>
                    <Loader />
                </View>
            )
        }

        if (status === 'initError') {
            return (
                <CenteredState
                    variant="error"
                    title="Не удалось подготовить звонок"
                    description="Попробуйте ещё раз."
                    action={{
                        label: 'Попробовать ещё раз',
                        onPress: onRetry,
                        variant: 'primary',
                    }}
                    secondaryAction={{ label: 'Назад', onPress: onCancel }}
                />
            )
        }

        if (status === 'expired') {
            return (
                <CenteredState
                    variant="error"
                    title="Мы не получили ваш звонок"
                    description="Попробуйте ещё раз или воспользуйтесь другим способом."
                    action={{
                        label: 'Попробовать ещё раз',
                        onPress: onRetry,
                        variant: 'primary',
                    }}
                    secondaryAction={
                        fallbackMethod
                            ? {
                                  label: fallbackLabel(fallbackMethod),
                                  onPress: handleFallback,
                              }
                            : undefined
                    }
                />
            )
        }

        const secondsLeft = TOTAL_TIMEOUT_SEC - elapsedSec
        const mm = Math.floor(secondsLeft / 60)
        const ss = secondsLeft % 60
        const timeLeft = `${mm}:${ss < 10 ? '0' : ''}${ss}`
        const fallbackUnlocked = elapsedSec >= FALLBACK_UNLOCK_SEC
        const fallbackWaitLeft = Math.max(0, FALLBACK_UNLOCK_SEC - elapsedSec)

        return (
            <>
                <View style={styles.waiting}>
                    <View style={styles.circle}>
                        <Icon name="phone" size={44} />
                    </View>

                    <Typography
                        type="body14"
                        color="secondary"
                        textAlign="center"
                    >
                        Позвоните на номер
                    </Typography>

                    <Typography type="num20" textAlign="center">
                        {initData?.call_phone_pretty || ''}
                    </Typography>

                    <View style={styles.hint}>
                        <Typography
                            type="body13"
                            color="secondary"
                            textAlign="center"
                        >
                            Мы сразу сбросим звонок, это бесплатно
                        </Typography>
                    </View>

                    <Typography
                        type="caption12"
                        color="tertiary"
                        textAlign="center"
                    >
                        Ожидание: {timeLeft}
                    </Typography>
                </View>

                <PillButton title="Позвонить" onPress={handleCall} />

                {fallbackMethod && (
                    <PillButton
                        title={
                            fallbackUnlocked
                                ? fallbackLabel(fallbackMethod)
                                : `${fallbackLabel(fallbackMethod)} (${fallbackWaitLeft})`
                        }
                        variant="secondary"
                        disabled={!fallbackUnlocked}
                        onPress={handleFallback}
                    />
                )}
            </>
        )
    }
)
