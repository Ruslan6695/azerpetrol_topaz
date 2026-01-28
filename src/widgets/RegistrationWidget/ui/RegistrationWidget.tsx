import { memo, useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { RegistrationForm } from '../../../features/RegistrationForm'
import { SendSmsCallCodeForm } from '../../../features/SendSmsCallCodeForm'
import { IUser, useFetchData, UserStore, useSendFetch } from '../../../shared'
import { useInput } from '../../../shared/CustomInput'
import { Loader } from '../../../shared/Loader'
import { showError } from '../../../shared/ToastComponent'
import { registrationWidgetApi } from '../api/registrationWidgetApi'
import { GetCaptcha } from '../../../features/GetCaptcha'
import { LoginRegistrationLayout } from '../../../layouts/LoginRegistrationLayout'
import { useFocusEffect } from 'expo-router'

type Props = {}

export const RegistrationWidget = memo((props: Props) => {
    const [road, setRoad] = useState<'input' | 'confirm' | 'captcha'>('input')
    const [confirmationType, setConfirmationType] = useState<'sms' | 'call'>(
        'call'
    )
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
            confType,
            captchaToken,
            regSession,
        }: {
            confType?: 'sms' | 'call'
            captchaToken?: string
            regSession?: string | null
        }) => {
            if (captchaToken) setCaptchaValue(captchaToken)
            if (phoneValue.length > 0) {
                await sendRegisterFetch({
                    args: {
                        phone: phoneValue,
                        type: confType
                            ? confType === 'sms'
                                ? 1
                                : 0
                            : confirmationType === 'call'
                              ? 0
                              : 1,
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
                        if (confType === 'sms') {
                            setConfirmationType('sms')
                        } else {
                            setConfirmationType('call')
                        }
                        setRoad('confirm')
                    },
                })
            } else {
                showError({ text: 'Введите номер телефона' })
            }
        },
        [phoneValue, confirmationType, nameValue, surnameValue]
    )

    const handleSubmitRegistration = useCallback(() => {
        setRoad('captcha')
    }, [phoneValue, confirmationType, nameValue, surnameValue])

    const handleToggleConfirmationType = useCallback(() => {
        if (confirmationType === 'call') {
            handleSubmitCaptcha({
                confType: 'sms',
                captchaToken: captchaValue,
                regSession: regSession,
            })
        } else {
            setConfirmationType('call')
        }
    }, [confirmationType, handleSubmitCaptcha, captchaValue, regSession])

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

    return (
        <LoginRegistrationLayout hideLogo={road === 'captcha'}>
            {isSendCodeLoading || isRegisterLoading ? (
                <Loader marginsPaddings={{ mt: 50, mb: 50 }} />
            ) : road === 'input' ? (
                <RegistrationForm
                    onSubmitRegistration={
                        captchaEnabledData &&
                        captchaEnabledData?.show_captcha === false
                            ? handleSubmitCaptcha
                            : handleSubmitRegistration
                    }
                    onChangeSurnameValue={handleChangeSurnameValue}
                    surnameValue={surnameValue}
                    onChangeNameValue={handleChangeNameValue}
                    nameValue={nameValue}
                    onChangePhoneValue={handleChangePhoneValue}
                    phoneValue={phoneValue}
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
        top: '-60%',
        position: 'absolute',
    },
})
