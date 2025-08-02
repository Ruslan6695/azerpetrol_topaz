import { useRouter } from 'expo-router'
import { memo, useRef } from 'react'
import { ESCREENS } from '../../../shared'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomInput } from '../../../shared/CustomInput'
import { PersonIcon } from '../../../shared/Icons/PersonIcon'
import { PhoneIcon } from '../../../shared/PhoneIcon'

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
                        marginsPaddings: { mt: 20, mb: 10 },
                    }}
                    icon={<PersonIcon />}
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
                        marginsPaddings: { mb: 10 },
                    }}
                    icon={<PersonIcon />}
                    value={surnameValue}
                    onChangeText={onChangeSurnameValue}
                />
                <CustomInput
                    onSubmitEditing={onSubmitRegistration}
                    ref={ref2}
                    mask="8 999 999 99 99"
                    placeholder="Номер телефона"
                    icon={<PhoneIcon />}
                    value={phoneValue}
                    onChangeText={onChangePhoneValue}
                />
                <CustomButton
                    onPress={onSubmitRegistration}
                    styled={{
                        marginsPaddings: { mb: 10, mt: 20 },
                    }}
                >
                    Регистрация
                </CustomButton>

                <CustomButton
                    onPress={() => {
                        router.navigate(ESCREENS.LOGIN)
                    }}
                    styled={{
                        type: 'DARK',
                        height: { value: 56 },
                    }}
                >
                    Вход
                </CustomButton>
            </>
        )
    }
)
