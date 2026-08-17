import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS, ThemeStore } from '../../../shared'
import { GlassInput } from '../../../shared/GlassInput'
import { Icon } from '../../../shared/Icons'
import { PillButton } from '../../../shared/PillButton'

type Props = {
    onChangePhoneValue: (value: string) => void
    phoneValue: string
    onSubmit: () => void
    /** Отправка в полёте — индикатор в кнопке */
    isLoading?: boolean
    /** Способы входа ещё грузятся — сабмит запрещён, но без индикатора */
    disabled?: boolean
}

// Маска «8 999 999 99 99» — 11 цифр, пробелы GlassInput вырезает сам
const PHONE_LENGTH = 11

export const LoginForm = memo(
    ({
        phoneValue,
        onChangePhoneValue,
        onSubmit,
        isLoading,
        disabled,
    }: Props) => {
        const router = useRouter()
        const COLORS = ThemeStore.useCOLORS()

        const handleGoToRegistration = useCallback(() => {
            router.navigate(ESCREENS.REGISTRATION)
        }, [router])

        return (
            <>
                <GlassInput
                    icon={
                        <Icon
                            name="phone"
                            size={20}
                            color={COLORS.TEXT.Secondary}
                            opacity={0.6}
                        />
                    }
                    keyboardType="numeric"
                    onSubmitEditing={onSubmit}
                    mask="8 999 999 99 99"
                    value={phoneValue}
                    onChangeText={onChangePhoneValue}
                    placeholder="Ваш номер телефона"
                />

                <PillButton
                    title="Войти"
                    onPress={onSubmit}
                    loading={isLoading}
                    disabled={disabled || phoneValue.length < PHONE_LENGTH}
                />

                <PillButton
                    title="Зарегистрироваться"
                    variant="secondary"
                    onPress={handleGoToRegistration}
                />
            </>
        )
    }
)
