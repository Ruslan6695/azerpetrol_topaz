import { memo, useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { LoginForm } from '../../../features/LoginForm'
import { SendSmsCallCodeForm } from '../../../features/SendSmsCallCodeForm'
import { IUser, useFetchData, UserStore, useSendFetch } from '../../../shared'
import { useInput } from '../../../shared/CustomInput'
import { Loader } from '../../../shared/Loader'
import { showError } from '../../../shared/ToastComponent'
import { loginWidgetApi } from '../api/loginWidgetApi'
import { GetCaptcha } from '../../../features/GetCaptcha'
import { LoginRegistrationLayout } from '../../../layouts/LoginRegistrationLayout'
import { useFocusEffect } from 'expo-router'

type Props = {}

export const LoginWidget = memo((props: Props) => {
    const [road, setRoad] = useState<'phoneInput' | 'confirm' | 'captcha'>(
        'phoneInput'
    )
    const [confirmationType, setConfirmationType] = useState<'sms' | 'call'>(
        'call'
    )
    const {
        handleChangeInputValue: handleChangePhoneValue,
        inputValue: phoneValue,
    } = useInput()
    const [captchaValue, setCaptchaValue] = useState('')
    const [loginSession, setLoginSession] = useState<string | null>(null)

    const setUser = UserStore.useSetUser()

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
            confType,
            captchaToken,
            loginSession,
        }: {
            confType?: 'sms' | 'call'
            captchaToken?: string
            loginSession?: string | null
        }) => {
            if (phoneValue.length > 0) {
                if (captchaToken) setCaptchaValue(captchaToken)

                await sendLoginFetch({
                    args: {
                        phone: phoneValue,
                        type: confType
                            ? confType === 'sms'
                                ? 1
                                : 0
                            : confirmationType === 'call'
                              ? 0
                              : 1,
                        captchaToken,
                        loginSession,
                    },
                    afterDataCallback(data) {
                        if (data?.login_session) {
                            setLoginSession(data.login_session)
                        }
                        if (confType === 'sms') {
                            setConfirmationType('sms')
                        } else {
                            setConfirmationType('call')
                        }
                        setRoad('confirm')
                    },
                    onErrorCallback(error) {
                        setRoad('phoneInput')
                    },
                })
            } else {
                showError({ text: 'Введите номер телефона' })
            }
        },
        [phoneValue, confirmationType]
    )

    const handleSubmitLogin = useCallback(() => {
        setRoad('captcha')
    }, [])

    const handleToggleConfirmationType = useCallback(() => {
        if (confirmationType === 'call') {
            handleSubmitCaptcha({
                confType: 'sms',
                captchaToken: captchaValue,
                loginSession: loginSession,
            })
        } else {
            setConfirmationType('call')
        }
    }, [confirmationType, handleSubmitCaptcha, captchaValue, loginSession])

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

    return (
        <LoginRegistrationLayout hideLogo={road === 'captcha'}>
            {isSendCodeLoading || isLoginLoading ? (
                <Loader marginsPaddings={{ mt: 50, mb: 50 }} />
            ) : road === 'phoneInput' ? (
                <LoginForm
                    onSubmit={
                        captchaEnabledData &&
                        captchaEnabledData?.show_captcha === false
                            ? handleSubmitCaptcha
                            : handleSubmitLogin
                    }
                    phoneValue={phoneValue}
                    onChangePhoneValue={handleChangePhoneValue}
                />
            ) : road === 'captcha' ? (
                <GetCaptcha onSubmitCaptcha={handleSubmitCaptcha} />
            ) : (
                <SendSmsCallCodeForm
                    confirmationType={confirmationType}
                    onToggleConfirmationType={handleToggleConfirmationType}
                    onSend={handleSubmitCode}
                />
            )}
        </LoginRegistrationLayout>
    )
})

const styles = StyleSheet.create({
    logo: {
        top: '-100%',
        position: 'absolute',
    },
})
