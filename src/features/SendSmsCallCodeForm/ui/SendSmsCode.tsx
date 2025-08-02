import React, { useCallback } from 'react'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../shared/CustomInput'
import { SmsIcon } from '../../../shared/Icons/SmsIcon'
import { CustomText } from '../../../shared/CustomText'
import { SIZES } from '../../../shared'

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
            <CustomText
                textAlign="center"
                fz={17}
                style={{ width: SIZES.WIDTH(0.85) }}
            >
                Мы отправили СМС на ваш номер телефона. Введите код из СМС.
            </CustomText>
            <CustomInput
                onSubmitEditing={handleSubmit}
                keyboardType="numeric"
                maxLength={4}
                styled={{
                    marginsPaddings: { mt: 20, mb: 20 },
                }}
                value={inputValue}
                onChangeText={handleChangeInputValue}
                placeholder="Код из СМС"
                icon={<SmsIcon />}
            />
            <CustomButton onPress={handleSubmit}>Подтвердить</CustomButton>
        </>
    )
}
