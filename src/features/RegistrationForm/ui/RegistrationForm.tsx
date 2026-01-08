import { useRouter } from 'expo-router'
import { memo, useRef } from 'react'
import { ButtonsSeparator } from '../../../entities/ButtonsSeparator'
import { ESCREENS } from '../../../shared'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomInput } from '../../../shared/CustomInput'

type Props = {
    onChangePhoneValue: (value: string) => void
    phoneValue: string
    onChangeNameValue: (value: string) => void
    nameValue: string
    onChangeSurnameValue: (value: string) => void
    surnameValue: string
    onSubmitRegistration: () => Promise<void>
}

export const RegistrationForm = memo(
    ({
        onChangePhoneValue,
        phoneValue,
        nameValue,
        onChangeNameValue,
        onChangeSurnameValue,
        surnameValue,
        onSubmitRegistration,
    }: Props) => {
        const router = useRouter()
        const ref1 = useRef<any>()
        const ref2 = useRef<any>()

        return (
            <>
                <CustomInput
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        if (ref1.current) {
                            ref1.current.getElement().focus()
                        }
                    }}
                    placeholder="Имя"
                    styled={{
                        marginsPaddings: { mb: 10 },
                        width: { type: 'absolute', value: '100%' },
                    }}
                    value={nameValue}
                    onChangeText={onChangeNameValue}
                />
                <CustomInput
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        if (ref2.current) {
                            ref2.current.getElement().focus()
                        }
                    }}
                    ref={ref1}
                    placeholder="Фамилия"
                    styled={{
                        width: { type: 'absolute', value: '100%' },
                    }}
                    value={surnameValue}
                    onChangeText={onChangeSurnameValue}
                />
                <CustomInput
                    styled={{
                        width: { type: 'absolute', value: '100%' },
                        marginsPaddings: { mt: 10, mb: 16 },
                    }}
                    onSubmitEditing={onSubmitRegistration}
                    ref={ref2}
                    mask="8 999 999 99 99"
                    placeholder="Номер телефона"
                    value={phoneValue}
                    onChangeText={onChangePhoneValue}
                />
                <CustomButton
                    onPress={onSubmitRegistration}
                    styled={{
                        borderRadius: 1000,
                        width: { type: 'absolute', value: '100%' },
                    }}
                >
                    Зарегистрироваться
                </CustomButton>
                <ButtonsSeparator />
                <CustomButton
                    onPress={() => {
                        router.navigate(ESCREENS.LOGIN)
                    }}
                    styled={{
                        borderRadius: 1000,
                        type: 'secondary',
                        height: { value: 56 },
                        width: { type: 'absolute', value: '100%' },
                    }}
                >
                    Войти
                </CustomButton>
            </>
        )
    }
)
