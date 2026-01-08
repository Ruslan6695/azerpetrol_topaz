import { memo, useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { LoginForm } from '../../../features/LoginForm'
import { SendSmsCallCodeForm } from '../../../features/SendSmsCallCodeForm'
import {
    IUser,
    UserStore,
    useSendFetch
} from '../../../shared'
import { useInput } from '../../../shared/CustomInput'
import { Loader } from '../../../shared/Loader'
import { showError } from '../../../shared/ToastComponent'
import { loginWidgetApi } from '../api/loginWidgetApi'

type Props = {}

export const LoginWidget = memo((props: Props) => {
    const [road, setRoad] = useState<'phoneInput' | 'confirm'>('phoneInput')
    const [confirmationType, setConfirmationType] = useState<'sms' | 'call'>(
        'call'
    )
    const setUser = UserStore.useSetUser()
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

    const {
        handleChangeInputValue: handleChangePhoneValue,
        inputValue: phoneValue,
    } = useInput()

    const handleSubmitLogin = useCallback(
        async (confType?: 'sms' | 'call') => {
            if (phoneValue.length > 0) {
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
                    },
                    afterDataCallback(data) {
                        if (confType === 'sms') {
                            setConfirmationType('sms')
                        } else {
                            setConfirmationType('call')
                        }
                        setRoad('confirm')
                    },
                    onErrorCallback(error) {},
                })
            } else {
                showError({ text: 'Введите номер телефона' })
            }
        },
        [phoneValue, confirmationType]
    )

    const handleToggleConfirmationType = useCallback(() => {
        if (confirmationType === 'call') {
            handleSubmitLogin('sms')
        } else {
            setConfirmationType('call')
        }
    }, [confirmationType, handleSubmitLogin])

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

    return (
        <>
            {isSendCodeLoading || isLoginLoading ? (
                <Loader marginsPaddings={{ mt: 50, mb: 50 }} />
            ) : road === 'phoneInput' ? (
                <LoginForm
                    onSubmit={handleSubmitLogin}
                    phoneValue={phoneValue}
                    onChangePhoneValue={handleChangePhoneValue}
                />
            ) : (
                <SendSmsCallCodeForm
                    confirmationType={confirmationType}
                    onToggleConfirmationType={handleToggleConfirmationType}
                    onSend={handleSubmitCode}
                />
            )}
        </>
    )
})

const styles = StyleSheet.create({
    logo: {
        top: '-100%',
        position: 'absolute',
    },
})
