import { useRouter } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    COLORS,
    ESCREENS,
    SIZES,
    ThemeStore,
    UserStore,
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../../shared/CustomInput'
import { PhoneIcon } from '../../../../shared/PhoneIcon'
import { showError } from '../../../../shared/ToastComponent'
import { ContactsIcon } from '../../../../shared/Icons/ContactsIcon'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

type Props = {
    name?: string
    phone?: string
    onTransfer: (p: { name?: string; phone: string; sum: number }) => void
}

export const TransferBalanceForm = ({ name, phone, onTransfer }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
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

    const styles = useMemo(
        () =>
            StyleSheet.create({
                phoneContainer: {
                    flexDirection: 'row',
                    width: '100%',
                    backgroundColor: COLORS.BACKGROUND.Tertiary,
                    alignItems: 'center',
                    marginBottom: SIZES.PX * 16,
                    borderRadius: SIZES.PX * 12,
                    paddingRight: SIZES.PX * 14,
                },
            }),
        [COLORS]
    )

    useEffect(() => {
        if (phone) handleChangePhoneValue(phone)
    }, [phone])

    return (
        <>
            <View style={styles.phoneContainer}>
                <CustomInput
                    mask="8 999 999 99 99"
                    keyboardType="numeric"
                    onChangeText={handleChangePhoneValue}
                    value={phoneValue}
                    styled={{
                        width: {
                            type: 'absolute',
                            value: SIZES.WIDTH(1) - 83 * SIZES.PX,
                        },
                    }}
                    placeholder="Введите номер телефона"
                />
                <CustomTouchableOpacity
                    style={{ padding: SIZES.PX * 5 }}
                    onPress={openContacts}
                >
                    <ContactsIcon />
                </CustomTouchableOpacity>
            </View>

            <CustomInput
                onSubmitEditing={handleSubmit}
                keyboardType="numeric"
                onChangeText={handleChangeSumValue}
                value={sumValue}
                styled={{
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mb: 20 },
                }}
                placeholder="Введите сумму"
            />
            <CustomButton onPress={handleSubmit} styled={{}}>
                Перевести
            </CustomButton>
        </>
    )
}
