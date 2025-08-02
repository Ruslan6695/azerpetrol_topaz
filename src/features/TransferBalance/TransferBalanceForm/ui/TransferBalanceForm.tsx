import { memo, useEffect } from 'react'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../../shared/CustomInput'
import { PhoneIcon } from '../../../../shared/PhoneIcon'
import { SumIcon } from '../../../../shared/SumIcon'
import { useNavigation, useRouter } from 'expo-router'
import { ESCREENS, UserStore } from '../../../../shared'
import { showError } from '../../../../shared/ToastComponent'
import { PersonIcon } from '../../../../shared/Icons/PersonIcon'

type Props = {
    name?: string
    phone?: string
    onTransfer: (p: { name?: string; phone: string; sum: number }) => void
}

export const TransferBalanceForm = ({ name, phone, onTransfer }: Props) => {
    const balance = UserStore.useBalance()
    const route = useRouter()
    const {
        handleChangeInputValue: handleChangePhoneValue,
        inputValue: phoneValue,
    } = useInput()
    const {
        handleChangeInputValue: handleChangeSumValue,
        inputValue: sumValue,
    } = useInput()

    const openContacts = () => {
        route.navigate(ESCREENS.CONTACTS)
    }

    const handleSubmit = () => {
        if (phoneValue.length > 0 && sumValue.length > 0) {
            if (+sumValue <= balance) {
                onTransfer({ name, phone: phoneValue, sum: +sumValue })
            } else {
                showError({ text: 'Недостаточно средств для перевода' })
            }
        } else {
            showError({ text: 'Заполните все поля' })
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
                mask="8 999 999 99 99"
                keyboardType="numeric"
                icon={<PhoneIcon />}
                onChangeText={handleChangePhoneValue}
                value={phoneValue}
                styled={{
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mt: 10, mb: 10 },
                }}
                placeholder="Перевести по номеру"
            />
            <CustomInput
                keyboardType="numeric"
                icon={<SumIcon />}
                onChangeText={handleChangeSumValue}
                value={sumValue}
                styled={{
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mb: 20 },
                }}
                placeholder="Введите сумму"
            />
            <CustomButton
                onPress={handleSubmit}
                styled={{
                    width: { type: 'absolute', value: '100%' },
                }}
            >
                ПЕРЕВЕСТИ СРЕДСТВА
            </CustomButton>
        </>
    )
}
