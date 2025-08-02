import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { CustomInput, useInput } from '../../../shared/CustomInput'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomText } from '../../../shared/CustomText'
import { COLORS, SIZES } from '../../../shared'
import { StyleSheet, View } from 'react-native'
import { PhoneIcon } from '../../../shared/PhoneIcon'
import { showError } from '../../../shared/ToastComponent'
import { DisabledIcon } from '../../../shared/DisabledIcon'

type Props = {
    sendSms: () => void
    onSendCode: (smsCode: string) => void
}

export const SendPhoneCallCode = memo(({ sendSms, onSendCode }: Props) => {
    const { handleChangeInputValue, inputValue } = useInput()
    const [timerToSms, setTimerToSms] = useState(30)
    const intervalToSmsRef = useRef<any>(null)
    const handleSubmit = useCallback(() => {
        if (inputValue.length <= 4) {
            onSendCode(inputValue)
        } else {
            showError({ text: 'Введите код' })
        }
    }, [inputValue, onSendCode])

    useEffect(() => {
        intervalToSmsRef.current = setInterval(() => {
            setTimerToSms((prev) => {
                if (prev === 1) {
                    if (intervalToSmsRef.current) {
                        clearInterval(intervalToSmsRef.current)
                    }
                }
                return (prev -= 1)
            })
        }, 1000)
    }, [])
    return (
        <>
            <CustomText
                textAlign="center"
                fz={17}
                marginsPaddings={{ mb: 20 }}
                style={{ width: SIZES.WIDTH(0.85) }}
            >
                На ваш телефон сейчас поступит звонок. Введите последние 4 цифры
                звонившего номера.
            </CustomText>

            <CustomInput
                mask="9999"
                icon={<PhoneIcon />}
                onSubmitEditing={handleSubmit}
                onChangeText={handleChangeInputValue}
                keyboardType="numeric"
                value={inputValue}
                placeholder="Последние 4 цифры номера"
            />
            <CustomButton
                onPress={handleSubmit}
                styled={{ marginsPaddings: { mt: 20, mb: 10 } }}
            >
                ПОДТВЕРДИТЬ
            </CustomButton>
            <CustomButton
                icon={timerToSms > 0 && <DisabledIcon />}
                disabled={timerToSms > 0}
                onPress={sendSms}
                styled={{ type: 'OUTLINED' }}
            >
                {timerToSms > 0
                    ? `${timerToSms}      Отправить смс-код`
                    : ' Отправить смс-код'}
            </CustomButton>
        </>
    )
})

const styles = StyleSheet.create({
    container: {
        width: SIZES.WIDTH(0.85),
        backgroundColor: COLORS.GRAY,
        padding: 15 * SIZES.PX,
        borderRadius: SIZES.PX * 10,
        marginBottom: SIZES.PX * 10,
    },
})
