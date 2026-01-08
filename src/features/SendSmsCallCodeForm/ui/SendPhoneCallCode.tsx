import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ButtonsSeparator } from '../../../entities/ButtonsSeparator'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../shared/CustomInput'
import { DisabledIcon } from '../../../shared/DisabledIcon'
import { showError } from '../../../shared/ToastComponent'
import { Typography } from '../../../shared/Typography'

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
            <Typography textAlign="center" marginsPaddings={{ mb: 20 }}>
                На ваш телефон сейчас поступит звонок. Введите последние 4 цифры
                звонившего номера.
            </Typography>

            <CustomInput
                mask="9999"
                onSubmitEditing={handleSubmit}
                onChangeText={handleChangeInputValue}
                keyboardType="numeric"
                value={inputValue}
                placeholder="Последние 4 цифры номера"
            />
            <CustomButton
                onPress={handleSubmit}
                styled={{ marginsPaddings: { mt: 16 } }}
            >
                ПОДТВЕРДИТЬ
            </CustomButton>
            <ButtonsSeparator />
            <CustomButton
                styled={{ type: 'secondary' }}
                icon={timerToSms > 0 && <DisabledIcon />}
                disabled={timerToSms > 0}
                onPress={sendSms}
            >
                {timerToSms > 0
                    ? `${timerToSms}      Отправить смс-код`
                    : ' Отправить смс-код'}
            </CustomButton>
        </>
    )
})
