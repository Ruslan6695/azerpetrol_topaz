import { memo, useCallback, useEffect, useState } from 'react'
import { useInput } from '../../../shared'
import { GlassInput } from '../../../shared/GlassInput'
import { PillButton } from '../../../shared/PillButton'
import { Typography } from '../../../shared/Typography'

const CODE_LENGTH = 4
const SMS_UNLOCK_SEC = 30

type Props = {
    sendSms: () => void
    onSendCode: (smsCode: string) => void
    isLoading?: boolean
}

export const SendPhoneCallCode = memo(
    ({ sendSms, onSendCode, isLoading }: Props) => {
        const { handleChangeInputValue, inputValue } = useInput()
        const [timerToSms, setTimerToSms] = useState(SMS_UNLOCK_SEC)

        const handleSubmit = useCallback(() => {
            onSendCode(inputValue)
        }, [inputValue, onSendCode])

        useEffect(() => {
            const id = setInterval(() => {
                setTimerToSms((prev) => {
                    if (prev <= 1) {
                        clearInterval(id)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(id)
        }, [])

        const isSmsLocked = timerToSms > 0

        return (
            <>
                <Typography type="body14" color="secondary" textAlign="center">
                    На ваш телефон сейчас поступит звонок. Введите последние 4
                    цифры звонившего номера.
                </Typography>

                <GlassInput
                    mask="9999"
                    onSubmitEditing={handleSubmit}
                    onChangeText={handleChangeInputValue}
                    keyboardType="number-pad"
                    value={inputValue}
                    placeholder="Последние 4 цифры номера"
                />

                <PillButton
                    title="Подтвердить"
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={inputValue.length < CODE_LENGTH}
                />

                <PillButton
                    title={
                        isSmsLocked
                            ? `Отправить смс-код (${timerToSms})`
                            : 'Отправить смс-код'
                    }
                    variant="secondary"
                    disabled={isSmsLocked}
                    onPress={sendSms}
                />
            </>
        )
    }
)
