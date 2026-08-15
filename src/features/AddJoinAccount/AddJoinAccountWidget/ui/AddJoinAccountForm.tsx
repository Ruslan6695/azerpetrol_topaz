import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { ESCREENS, SIZES, SPACING } from '../../../../shared'
import { useInput } from '../../../../shared/CustomInput'
import { GlassInput } from '../../../../shared/GlassInput'
import { Icon } from '../../../../shared/Icons'
import { PillButton } from '../../../../shared/PillButton'
import { showError } from '../../../../shared/ToastComponent'
import { Typography } from '../../../../shared/Typography'
import { TAddJoinAccountDraft } from '../config/types/TAddJoinAccountDraft'

type Props = {
    name?: string
    phone?: string
    onSubmit: (draft: TAddJoinAccountDraft) => void
}

export const AddJoinAccountForm = memo(({ onSubmit, name, phone }: Props) => {
    const route = useRouter()
    const {
        handleChangeInputValue: handleChangePhoneValue,
        inputValue: phoneValue,
    } = useInput()

    // Цель возврата передаём явно: экран контактов подставит номер обратно
    // именно в эту форму.
    const handleOpenContacts = useCallback(() => {
        route.navigate({
            pathname: ESCREENS.CONTACTS,
            params: { onSelectLink: ESCREENS.ADD_JOIN_AСCOUNT },
        })
    }, [route])

    const handleSubmit = useCallback(() => {
        if (phoneValue.length > 0) {
            onSubmit({ phone: phoneValue, name })
        } else {
            showError({ text: 'Введите номер телефона' })
        }
    }, [phoneValue, name, onSubmit])

    // Номер, выбранный на экране контактов, приходит route-параметром.
    useEffect(() => {
        if (phone) handleChangePhoneValue(phone)
    }, [phone, handleChangePhoneValue])

    const styles = StyleSheet.create({
        container: {
            gap: SPACING.LG * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <Typography type="body13" color="secondary">
                Привязанный аккаунт будет тратить и получать бонусы с вашего
                общего счёта.
            </Typography>

            <GlassInput
                onSubmitEditing={handleSubmit}
                mask="8 999 999 99 99"
                keyboardType="numeric"
                onChangeText={handleChangePhoneValue}
                value={phoneValue}
                placeholder="Введите номер телефона"
                icon={<Icon name="phone" size={20} opacity={0.6} />}
            />

            <PillButton
                title="Выбрать из контактов"
                variant="secondary"
                size="md"
                onPress={handleOpenContacts}
                icon={<Icon name="person" size={18} />}
            />

            <PillButton title="Отправить приглашение" onPress={handleSubmit} />
        </View>
    )
})
