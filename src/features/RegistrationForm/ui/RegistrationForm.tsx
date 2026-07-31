import { useRouter } from 'expo-router'
import { memo, useCallback, useRef } from 'react'
import { ESCREENS, ThemeStore } from '../../../shared'
import { GlassInput } from '../../../shared/GlassInput'
import { Icon } from '../../../shared/Icons'
import { LinkButton } from '../../../shared/LinkButton'
import { PillButton } from '../../../shared/PillButton'

type Props = {
    onChangePhoneValue: (value: string) => void
    phoneValue: string
    onChangeNameValue: (value: string) => void
    nameValue: string
    onChangeSurnameValue: (value: string) => void
    surnameValue: string
    onSubmitRegistration: () => void
    /** Отправка в полёте — индикатор в кнопке */
    isLoading?: boolean
    /** Способы подтверждения ещё грузятся — сабмит запрещён, но без индикатора */
    disabled?: boolean
}

const PHONE_LENGTH = 11

// Макет рисует два поля — имя и телефон, но registration/ и callcheck-инициация
// требуют name и surname раздельно, поэтому фамилия остаётся отдельным полем.
export const RegistrationForm = memo(
    ({
        onChangePhoneValue,
        phoneValue,
        nameValue,
        onChangeNameValue,
        onChangeSurnameValue,
        surnameValue,
        onSubmitRegistration,
        isLoading,
        disabled,
    }: Props) => {
        const router = useRouter()
        const COLORS = ThemeStore.useCOLORS()
        const surnameRef = useRef<any>(null)
        const phoneRef = useRef<any>(null)

        const handleFocusSurname = useCallback(() => {
            surnameRef.current?.getElement()?.focus()
        }, [])

        const handleFocusPhone = useCallback(() => {
            phoneRef.current?.getElement()?.focus()
        }, [])

        const handleGoToLogin = useCallback(() => {
            router.navigate(ESCREENS.LOGIN)
        }, [router])

        const isSubmitDisabled =
            disabled ||
            phoneValue.length < PHONE_LENGTH ||
            nameValue.length === 0 ||
            surnameValue.length === 0

        return (
            <>
                <GlassInput
                    icon={
                        <Icon
                            name="person"
                            size={20}
                            color={COLORS.Icon.Secondary}
                            opacity={0.6}
                        />
                    }
                    returnKeyType="next"
                    onSubmitEditing={handleFocusSurname}
                    placeholder="Ваше имя"
                    value={nameValue}
                    onChangeText={onChangeNameValue}
                />

                <GlassInput
                    ref={surnameRef}
                    icon={
                        <Icon
                            name="person"
                            size={20}
                            color={COLORS.Icon.Secondary}
                            opacity={0.6}
                        />
                    }
                    returnKeyType="next"
                    onSubmitEditing={handleFocusPhone}
                    placeholder="Фамилия"
                    value={surnameValue}
                    onChangeText={onChangeSurnameValue}
                />

                <GlassInput
                    ref={phoneRef}
                    icon={
                        <Icon
                            name="phone"
                            size={20}
                            color={COLORS.Icon.Secondary}
                            opacity={0.6}
                        />
                    }
                    keyboardType="numeric"
                    onSubmitEditing={onSubmitRegistration}
                    mask="8 999 999 99 99"
                    placeholder="Номер телефона"
                    value={phoneValue}
                    onChangeText={onChangePhoneValue}
                />

                <PillButton
                    title="Зарегистрироваться"
                    onPress={onSubmitRegistration}
                    loading={isLoading}
                    disabled={isSubmitDisabled}
                />

                <LinkButton
                    title="У меня уже есть аккаунт"
                    onPress={handleGoToLogin}
                />
            </>
        )
    }
)
