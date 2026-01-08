import { useRouter } from 'expo-router'
import { memo, useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    ESCREENS,
    SIZES,
    ThemeStore
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../../shared/CustomInput'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { ContactsIcon } from '../../../../shared/Icons/ContactsIcon'
import { showError } from '../../../../shared/ToastComponent'

type Props = {
    name?: string
    phone?: string
    onSubmit: (p: { name?: string; phone: string }) => void
}

export const AddJoinAccountForm = memo(({ onSubmit, name, phone }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
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

    return (
        <>
            <View style={styles.phoneContainer}>
                <CustomInput
                    onSubmitEditing={handleSubmit}
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
                    placeholder="Пригласить по номеру"
                />
                <CustomTouchableOpacity
                    style={{ padding: SIZES.PX * 5 }}
                    onPress={openContacts}
                >
                    <ContactsIcon />
                </CustomTouchableOpacity>
            </View>

            <CustomButton onPress={handleSubmit}>Пригласить</CustomButton>
        </>
    )
})
