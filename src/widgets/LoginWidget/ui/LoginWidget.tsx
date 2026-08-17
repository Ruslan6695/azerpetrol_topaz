import { memo, useCallback, useEffect, useState } from 'react'
import { LoginForm } from '../../../features/LoginForm'
import { SendSmsCallCodeForm } from '../../../features/SendSmsCallCodeForm'
import { SendCallcheckWait } from '../../../features/SendCallcheckWait'
import {
    authMethodsApi,
    EAuthMethod,
    IUser,
    TAuthStep,
    useFetchData,
    useInput,
    UserStore,
    useSendFetch,
} from '../../../shared'
import { showError } from '../../../shared/ToastComponent'
import { loginWidgetApi } from '../api/loginWidgetApi'
import { GetCaptcha } from '../../../features/GetCaptcha'
import { useFocusEffect } from 'expo-router'

type Props = {
    /** Экран решает по шагу, показывать ли шапку с вордмарком */
    onStepChange?: (step: TAuthStep) => void
}

const DEFAULT_METHODS: EAuthMethod[] = [EAuthMethod.Call, EAuthMethod.Sms]

export const LoginWidget = memo(({ onStepChange }: Props) => {
    const [road, setRoad] = useState<'phoneInput' | 'confirm' | 'captcha'>(
        'phoneInput'
    )
    const [methods, setMethods] = useState<EAuthMethod[]>(DEFAULT_METHODS)
    const [currentMethod, setCurrentMethod] = useState<EAuthMethod>(
        EAuthMethod.Call
    )
    const [methodsLoading, setMethodsLoading] = useState(true)
    const {
        handleChangeInputValue: handleChangePhoneValue,
        inputValue: phoneValue,
    } = useInput()
    const [captchaValue, setCaptchaValue] = useState('')
    const [loginSession, setLoginSession] = useState<string | null>(null)

    const setUser = UserStore.useSetUser()

    useEffect(() => {
        let cancelled = false
        authMethodsApi
            .getAuthMethods()
            .then((data) => {
                if (cancelled) return
                const next =
                    data?.methods && data.methods.length > 0
                        ? data.methods
                        : DEFAULT_METHODS
                setMethods(next)
                setCurrentMethod(next[0])
            })
            .catch(() => {
                if (cancelled) return
                setMethods(DEFAULT_METHODS)
                setCurrentMethod(DEFAULT_METHODS[0])
            })
            .finally(() => {
                if (cancelled) return
                setMethodsLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    const fallbackMethod = methods.find((m) => m !== currentMethod)

    const { data: captchaEnabledData, fetchData: fetchCaptchaEnabledData } =
        useFetchData({
            apiCallback: loginWidgetApi.checkCaptchaEnabled,
            errorText: 'Произошла ошибка',
        })

    const { isSendFetchLoading: isLoginLoading, sendFetch: sendLoginFetch } =
        useSendFetch({
            apiCallback: loginWidgetApi.login,
            errorText: 'Произошла ошибка при авторизации',
        })

    const { isSendFetchLoading: isSendCodeLoading, sendFetch: sendCode } =
        useSendFetch<{ code: string; phone: string }, IUser>({
            apiCallback: loginWidgetApi.sendCode,
            errorText: 'Ошибка при авторизации',
        })

    const handleSubmitCaptcha = useCallback(
        async ({
            method,
            captchaToken,
            loginSession,
        }: {
            method?: EAuthMethod
            captchaToken?: string
            loginSession?: string | null
        }) => {
            if (phoneValue.length === 0) {
                showError({ text: 'Введите номер телефона' })
                return
            }
            if (captchaToken) setCaptchaValue(captchaToken)

            const targetMethod = method ?? currentMethod

            if (targetMethod === EAuthMethod.Callcheck) {
                setCurrentMethod(EAuthMethod.Callcheck)
                setRoad('confirm')
                return
            }

            await sendLoginFetch({
                args: {
                    phone: phoneValue,
                    type: targetMethod === EAuthMethod.Sms ? 1 : 0,
                    captchaToken,
                    loginSession,
                },
                afterDataCallback(data) {
                    if (data?.login_session) {
                        setLoginSession(data.login_session)
                    }
                    setCurrentMethod(targetMethod)
                    setRoad('confirm')
                },
                onErrorCallback(error) {
                    setRoad('phoneInput')
                },
            })
        },
        [phoneValue, currentMethod]
    )

    const handleSubmitLogin = useCallback(() => {
        setRoad('captcha')
    }, [])

    const handleToggleConfirmationType = useCallback(() => {
        if (currentMethod === EAuthMethod.Call) {
            handleSubmitCaptcha({
                method: EAuthMethod.Sms,
                captchaToken: captchaValue,
                loginSession,
            })
        } else {
            setCurrentMethod(EAuthMethod.Call)
        }
    }, [currentMethod, handleSubmitCaptcha, captchaValue, loginSession])

    const handleCallcheckFallback = useCallback(
        (nextMethod: EAuthMethod) => {
            handleSubmitCaptcha({
                method: nextMethod,
                captchaToken: captchaValue,
                loginSession,
            })
        },
        [handleSubmitCaptcha, captchaValue, loginSession]
    )

    const handleCallcheckCancel = useCallback(() => {
        setRoad('phoneInput')
    }, [])

    const handleCallcheckRetry = useCallback(() => {
        setCaptchaValue('')
        const captchaDisabled = captchaEnabledData?.show_captcha === false
        if (captchaDisabled) {
            handleSubmitCaptcha({ method: EAuthMethod.Callcheck })
        } else {
            setRoad('captcha')
        }
    }, [captchaEnabledData, handleSubmitCaptcha])

    const handleCallcheckSuccess = useCallback(
        (user: IUser) => {
            setUser(user)
        },
        [setUser]
    )

    const handleSubmitCode = useCallback(
        async (code: string) => {
            await sendCode({
                args: { code, phone: phoneValue },
                afterDataCallback(data) {
                    setUser(data)
                },
                onErrorCallback(error) {},
            })
        },
        [phoneValue]
    )

    useFocusEffect(
        useCallback(() => {
            fetchCaptchaEnabledData({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {},
            })
        }, [])
    )

    // Загрузка больше не подменяет содержимое шита целиком — иначе шит
    // схлопывается до высоты лоадера и прыгает. Индикатор живёт в кнопке формы.
    // methodsLoading идёт отдельно: пока способы входа не приехали, сабмит
    // запрещён, но крутить спиннер на холодном старте незачем.
    const isLoading = isSendCodeLoading || isLoginLoading

    useEffect(() => {
        onStepChange?.(road === 'phoneInput' ? 'form' : road)
    }, [road, onStepChange])

    if (road === 'captcha') {
        return (
            <GetCaptcha
                onSubmitCaptcha={({ captchaToken }) => {
                    handleSubmitCaptcha({ captchaToken })
                }}
            />
        )
    }

    if (road === 'phoneInput') {
        return (
            <LoginForm
                isLoading={isLoading}
                disabled={methodsLoading}
                onSubmit={
                    captchaEnabledData &&
                    captchaEnabledData?.show_captcha === false
                        ? async () => {
                              await handleSubmitCaptcha({})
                          }
                        : handleSubmitLogin
                }
                phoneValue={phoneValue}
                onChangePhoneValue={handleChangePhoneValue}
            />
        )
    }

    if (currentMethod === EAuthMethod.Callcheck) {
        return (
            <SendCallcheckWait
                mode="login"
                phone={phoneValue}
                captchaToken={captchaValue}
                fallbackMethod={fallbackMethod}
                onSuccess={handleCallcheckSuccess}
                onFallback={handleCallcheckFallback}
                onCancel={handleCallcheckCancel}
                onRetry={handleCallcheckRetry}
            />
        )
    }

    return (
        <SendSmsCallCodeForm
            isLoading={isLoading}
            confirmationType={
                currentMethod === EAuthMethod.Sms ? 'sms' : 'call'
            }
            onToggleConfirmationType={handleToggleConfirmationType}
            onSend={handleSubmitCode}
        />
    )
})
