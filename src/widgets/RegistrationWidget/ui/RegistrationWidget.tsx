import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { RegistrationForm } from '../../../features/RegistrationForm'
import { SendSmsCallCodeForm } from '../../../features/SendSmsCallCodeForm'
import { IUser, UserStore, useSendFetch } from '../../../shared'
import { useInput } from '../../../shared/CustomInput'
import { Loader } from '../../../shared/Loader'
import { LogoFull } from '../../../shared/Logo'
import { showError } from '../../../shared/ToastComponent'
import { registrationWidgetApi } from '../api/registrationWidgetApi'

type Props = {}

export const RegistrationWidget = memo((props: Props) => {
    const [road, setRoad] = useState<'input' | 'confirm'>('input')
    const [confirmationType, setConfirmationType] = useState<'sms' | 'call'>(
        'call'
    )

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

    const handleSubmitRegistration = useCallback(
        async (confType?: 'sms' | 'call') => {
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
                    },
                    afterDataCallback(data) {
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

    const handleToggleConfirmationType = useCallback(() => {
        if (confirmationType === 'call') {
            handleSubmitRegistration('sms')
        } else {
            setConfirmationType('call')
        }
    }, [confirmationType, handleSubmitRegistration])

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

    return (
        <>
            {isSendCodeLoading || isRegisterLoading ? (
                <Loader marginsPaddings={{ mt: 50, mb: 50 }} />
            ) : road === 'input' ? (
                <RegistrationForm
                    onSubmitRegistration={handleSubmitRegistration}
                    onChangeSurnameValue={handleChangeSurnameValue}
                    surnameValue={surnameValue}
                    onChangeNameValue={handleChangeNameValue}
                    nameValue={nameValue}
                    onChangePhoneValue={handleChangePhoneValue}
                    phoneValue={phoneValue}
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
        top: '-60%',
        position: 'absolute',
    },
})
