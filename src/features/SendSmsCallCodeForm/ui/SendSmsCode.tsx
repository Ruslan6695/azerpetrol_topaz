import React, { useCallback } from 'react'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../shared/CustomInput'
import { Typography } from '../../../shared/Typography'

type Props = {
    onSubmit: (smsCode: string) => void
}

export const SendSmsCode = ({ onSubmit }: Props) => {
    const { handleChangeInputValue, inputValue } = useInput()

    const handleSubmit = useCallback(() => {
        onSubmit(inputValue)
    }, [onSubmit, inputValue])
    return (
        <>
            <Typography textAlign="center">
                Мы отправили СМС на ваш номер телефона. Введите код из СМС.
            </Typography>
            <CustomInput
                onSubmitEditing={handleSubmit}
                keyboardType="numeric"
                maxLength={4}
                styled={{
                    marginsPaddings: { mt: 20, mb: 16 },
                }}
                value={inputValue}
                onChangeText={handleChangeInputValue}
                placeholder="Код из СМС"
            />
            <CustomButton onPress={handleSubmit}>Подтвердить</CustomButton>
        </>
    )
}
