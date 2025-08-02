import { useFocusEffect } from 'expo-router'
import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { LoginForm } from '../../../features/LoginForm'
import { OpenUseTerms } from '../../../features/OpenUseTerms'
import { SendSmsCallCodeForm } from '../../../features/SendSmsCallCodeForm'
import {
    COLORS,
    IUser,
    SIZES,
    UserStore,
    useModal,
    useSendFetch,
} from '../../../shared'
import { useInput } from '../../../shared/CustomInput'
import { Loader } from '../../../shared/Loader'
import { LogoFull } from '../../../shared/Logo'
import { MPLayout } from '../../../shared/MpLayout'
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
                    onErrorCallback(error) {
                    },
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
                onErrorCallback(error) {
                  
                },
            })
        },
        [phoneValue]
    )

   
    

    return (
        <>
            <View style={styles.wrapper}>
                <View style={styles.logo}>
                    <LogoFull width={250} height={160} />
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
                            onToggleConfirmationType={
                                handleToggleConfirmationType
                            }
                            onSend={handleSubmitCode}
                        />
                    )}

                    <MPLayout mt={30}>
                        <OpenUseTerms />
                    </MPLayout>
                </View>
            </View>
        </>
    )
})

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.WHITE,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: SIZES.PX * 40,
        borderTopRightRadius: SIZES.PX * 40,
    },
    logo: {
        top: -60 * SIZES.PX,
        flexDirection: 'column',
        alignItems: 'center',
    },
})
