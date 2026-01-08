import { useRouter } from 'expo-router'
import { memo } from 'react'
import { COLORS, ESCREENS, SIZES } from '../../../shared'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomInput } from '../../../shared/CustomInput'
import { PhoneIcon } from '../../../shared/PhoneIcon'
import { StyleSheet, View } from 'react-native'
import { Typography } from '../../../shared/Typography'
import { ButtonsSeparator } from '../../../entities/ButtonsSeparator'

type Props = {
    onChangePhoneValue: (value: string) => void
    phoneValue: string
    onSubmit: () => Promise<void>
}

export const LoginForm = memo(
    ({ phoneValue, onChangePhoneValue, onSubmit }: Props) => {
        const router = useRouter()

        return (
            <>
                <CustomInput
                    keyboardType="numeric"
                    onSubmitEditing={onSubmit}
                    mask="8 999 999 99 99"
                    value={phoneValue}
                    onChangeText={onChangePhoneValue}
                    placeholder="Ваш номер телефона"
                    styled={{
                        width: { type: 'absolute', value: '100%' },
                    }}
                />
                <CustomButton
                    onPress={onSubmit}
                    styled={{
                        borderRadius: 1000,
                        marginsPaddings: { mt: 16 },
                        width: { type: 'absolute', value: '100%' },
                    }}
                >
                    Войти
                </CustomButton>
                <ButtonsSeparator />
                <CustomButton
                    onPress={() => {
                        router.navigate(ESCREENS.REGISTRATION)
                    }}
                    styled={{
                        borderRadius: 1000,

                        type: 'secondary',
                        width: { type: 'absolute', value: '100%' },
                    }}
                >
                    Зарегистрироваться
                </CustomButton>
            </>
        )
    }
)
