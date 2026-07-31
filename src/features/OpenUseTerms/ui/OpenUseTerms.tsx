import { memo, useCallback } from 'react'
import { Linking } from 'react-native'
import { ThemeStore, USE_TERMS_LINK } from '../../../shared'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../shared/Typography'

type Props = {}

// В макете (строка 42) это статичная подпись caption12; ссылку на соглашение
// оставляем кликабельной — иначе документ становится недостижим из приложения.
export const OpenUseTerms = memo((props: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const handleOpenTerms = useCallback(() => {
        Linking.openURL(USE_TERMS_LINK)
    }, [])

    return (
        <>
            <Typography type="caption12" color="secondary">
                Продолжая, я принимаю условия{' '}
            </Typography>
            <CustomTouchableOpacity
                onPress={handleOpenTerms}
                activeOpacity={0.6}
            >
                <Typography
                    type="caption12"
                    customColor={COLORS.ACCENT.Primary}
                >
                    Пользовательского соглашения
                </Typography>
            </CustomTouchableOpacity>
        </>
    )
})
