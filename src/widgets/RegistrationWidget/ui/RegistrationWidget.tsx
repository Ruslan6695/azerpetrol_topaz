import { memo, useCallback, useEffect, useState } from 'react'
import { RegistrationForm } from '../../../features/RegistrationForm'
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
import { registrationWidgetApi } from '../api/registrationWidgetApi'
import { GetCaptcha } from '../../../features/GetCaptcha'
import { useFocusEffect } from 'expo-router'

type Props = {
    /** Экран решает по шагу, показывать ли шапку с вордмарком */
    onStepChange?: (step: TAuthStep) => void
}

const DEFAULT_METHODS: EAuthMethod[] = [EAuthMethod.Call, EAuthMethod.Sms]

export const RegistrationWidget = memo(({ onStepChange }: Props) => {
    const [road, setRoad] = useState<'input' | 'confirm' | 'captcha'>('input')
    const [methods, setMethods] = useState<EAuthMethod[]>(DEFAULT_METHODS)
    const [currentMethod, setCurrentMethod] = useState<EAuthMethod>(
        EAuthMethod.Call
    )
    const [methodsLoading, setMethodsLoading] = useState(true)
    const [captchaValue, setCaptchaValue] = useState('')
    const [regSession, setRegSession] = useState<string | null>(null)

    const {
        handleChangeInputValue: handleChangePhoneValue,
        inputValue: phoneValue,
    } = useInput()
    const {
        handleChangeInputValue: handleChangeNameValue,
        inputValue: nameValue,
    } = useInput()
    const {
        handleChangeInputValue: handleChangeSurnameValue,
        inputValue: surnameValue,
    } = useInput()

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
            apiCallback: registrationWidgetApi.checkCaptchaEnabled,
            errorText: 'Произошла ошибка',
        })

    const {
        isSendFetchLoading: isRegisterLoading,
        sendFetch: sendRegisterFetch,
    } = useSendFetch({
        apiCallback: registrationWidgetApi.register,
        errorText: 'Ошибка при регистрации',
    })
    const { isSendFetchLoading: isSendCodeLoading, sendFetch: sendCode } =
        useSendFetch<{ code: string; phone: string }, IUser>({
            apiCallback: registrationWidgetApi.sendCode,
            errorText: 'Ошибка при регистрации',
        })

    const setUser = UserStore.useSetUser()

    const handleSubmitCaptcha = useCallback(
        async ({
            method,
            captchaToken,
            regSession,
        }: {
            method?: EAuthMethod
            captchaToken?: string
            regSession?: string | null
        }) => {
            if (captchaToken) setCaptchaValue(captchaToken)
            if (phoneValue.length === 0) {
                showError({ text: 'Введите номер телефона' })
                return
            }

            const targetMethod = method ?? currentMethod

            if (targetMethod === EAuthMethod.Callcheck) {
                setCurrentMethod(EAuthMethod.Callcheck)
                setRoad('confirm')
                return
            }

            await sendRegisterFetch({
                args: {
                    phone: phoneValue,
                    type: targetMethod === EAuthMethod.Sms ? 1 : 0,
                    name: nameValue,
                    surname: surnameValue,
                    captchaToken,
                    regSession,
                },
                onErrorCallback(error) {
                    setRoad('input')
                },
                afterDataCallback(data) {
                    if (data?.reg_session) {
                        setRegSession(data.reg_session)
                    }
                    setCurrentMethod(targetMethod)
                    setRoad('confirm')
                },
            })
        },
        [phoneValue, currentMethod, nameValue, surnameValue]
    )

    const handleSubmitRegistration = useCallback(() => {
        setRoad('captcha')
    }, [])

    const handleToggleConfirmationType = useCallback(() => {
        if (currentMethod === EAuthMethod.Call) {
            handleSubmitCaptcha({
                method: EAuthMethod.Sms,
                captchaToken: captchaValue,
                regSession,
            })
        } else {
            setCurrentMethod(EAuthMethod.Call)
        }
    }, [currentMethod, handleSubmitCaptcha, captchaValue, regSession])

    const handleCallcheckFallback = useCallback(
        (nextMethod: EAuthMethod) => {
            handleSubmitCaptcha({
                method: nextMethod,
                captchaToken: captchaValue,
                regSession,
            })
        },
        [handleSubmitCaptcha, captchaValue, regSession]
    )

    const handleCallcheckCancel = useCallback(() => {
        setRoad('input')
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

    // Индикатор загрузки живёт в кнопке формы, а не подменяет весь шит.
    // methodsLoading идёт отдельным disabled — без спиннера на холодном старте.
    const isLoading = isSendCodeLoading || isRegisterLoading

    useEffect(() => {
        onStepChange?.(road === 'input' ? 'form' : road)
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

    if (road === 'input') {
        return (
            <RegistrationForm
                isLoading={isLoading}
                disabled={methodsLoading}
                onSubmitRegistration={
                    captchaEnabledData &&
                    captchaEnabledData?.show_captcha === false
                        ? () => {
                              handleSubmitCaptcha({})
                          }
                        : handleSubmitRegistration
                }
                onChangeSurnameValue={handleChangeSurnameValue}
                surnameValue={surnameValue}
                onChangeNameValue={handleChangeNameValue}
                nameValue={nameValue}
                onChangePhoneValue={handleChangePhoneValue}
                phoneValue={phoneValue}
            />
        )
    }

    if (currentMethod === EAuthMethod.Callcheck) {
        return (
            <SendCallcheckWait
                mode="registration"
                phone={phoneValue}
                captchaToken={captchaValue}
                name={nameValue}
                surname={surnameValue}
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
