import { useRouter } from 'expo-router'
import { memo } from 'react'
import { ESCREENS } from '../../../shared'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomInput } from '../../../shared/CustomInput'
import { PhoneIcon } from '../../../shared/PhoneIcon'

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
                    placeholder="Номер телефона"
                    styled={{
                        marginsPaddings: { mt: 20 },
                    }}
                    icon={<PhoneIcon />}
                />
                <CustomButton
                    onPress={onSubmit}
                    styled={{
                        marginsPaddings: { mb: 10, mt: 20 },
                    }}
                >
                    Вход
                </CustomButton>

                <CustomButton
                    onPress={() => {
                        router.navigate(ESCREENS.REGISTRATION)
                    }}
                    styled={{
                        type: 'DARK',
                    }}
                >
                    Регистрация
                </CustomButton>
            </>
        )
    }
)
