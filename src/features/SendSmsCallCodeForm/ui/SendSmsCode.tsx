import { memo, useCallback } from 'react'
import { useInput } from '../../../shared'
import { GlassInput } from '../../../shared/GlassInput'
import { PillButton } from '../../../shared/PillButton'
import { Typography } from '../../../shared/Typography'

const CODE_LENGTH = 4

type Props = {
    onSubmit: (smsCode: string) => void
    isLoading?: boolean
}

export const SendSmsCode = memo(({ onSubmit, isLoading }: Props) => {
    const { handleChangeInputValue, inputValue } = useInput()

    const handleSubmit = useCallback(() => {
        onSubmit(inputValue)
    }, [onSubmit, inputValue])

    return (
        <>
            <Typography type="body14" color="secondary" textAlign="center">
                Мы отправили СМС на ваш номер телефона. Введите код из СМС.
            </Typography>

            <GlassInput
                onSubmitEditing={handleSubmit}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                value={inputValue}
                onChangeText={handleChangeInputValue}
                placeholder="Код из СМС"
            />

            <PillButton
                title="Подтвердить"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={inputValue.length < CODE_LENGTH}
            />
        </>
    )
})
