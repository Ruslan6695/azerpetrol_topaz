import { memo, useEffect } from 'react'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../../shared/CustomInput'
import { PhoneIcon } from '../../../../shared/PhoneIcon'
import { SumIcon } from '../../../../shared/SumIcon'
import { PersonIcon } from '../../../../shared/Icons/PersonIcon'
import { useRouter } from 'expo-router'
import { ESCREENS, UserStore } from '../../../../shared'
import { showError } from '../../../../shared/ToastComponent'

type Props = {
    name?: string
    phone?: string
    onSubmit: (p: { name?: string; phone: string }) => void
}

export const AddJoinAccountForm = memo(({ onSubmit, name, phone }: Props) => {
    const route = useRouter()
    const {
        handleChangeInputValue: handleChangePhoneValue,
        inputValue: phoneValue,
    } = useInput()

    const openContacts = () => {
        route.navigate({
            pathname: ESCREENS.CONTACTS,
            params: { onSelectLink: ESCREENS.ADD_JOIN_AСCOUNT },
        })
    }

    const handleSubmit = () => {
        if (phoneValue.length > 0) {
            onSubmit({ phone: phoneValue, name })
        } else {
            showError({ text: 'Введите номер телефона' })
        }
    }

    useEffect(() => {
        if (phone) handleChangePhoneValue(phone)
    }, [phone])
    return (
        <>
            <CustomButton
                onPress={openContacts}
                icon={<PersonIcon white />}
                styled={{
                    width: { type: 'absolute', value: '100%' },
                    type: 'DARK',
                }}
            >
                {name || 'Выбрать из контактов'}
            </CustomButton>
            <CustomInput
                onSubmitEditing={handleSubmit}
                mask="8 999 999 99 99"
                keyboardType="numeric"
                icon={<PhoneIcon />}
                onChangeText={handleChangePhoneValue}
                value={phoneValue}
                styled={{
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mt: 10, mb: 10 },
                }}
                placeholder="Привязать по номеру"
            />

            <CustomButton
                onPress={handleSubmit}
                styled={{
                    width: { type: 'absolute', value: '100%' },
                }}
            >
                ПРИВЯЗАТЬ АККАУНТ
            </CustomButton>
        </>
    )
})
