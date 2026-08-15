import { memo } from 'react'
import { StyleSheet } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { MPLayout } from '../../MpLayout'
import { Typography } from '../../Typography'

type Props = {
    size?: number
    bold?: boolean
    color?: string
    ml?: number
    mt?: number
}

// Знак валюты рядом с суммой. Раньше здесь стояла иконка «B» из
// @expo/vector-icons; теперь это символ ₽ шрифтом Manrope — так он совпадает
// по начертанию с числом, к которому приписан.
//
// Размер приходит пропом size (компонент подстраивается под соседний текст),
// поэтому тип из лестницы Typography перекрывается своим fontSize —
// единственный способ сохранить прежний контракт всех восьми мест вызова.
const DEFAULT_SIZE = 16
const DEFAULT_BOLD_SIZE = 24

export const BonusIcon = memo(({ size, color, bold, ml, mt }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        sign: {
            fontSize:
                size ?? (bold ? DEFAULT_BOLD_SIZE : DEFAULT_SIZE) * SIZES.PX,
        },
    })

    return (
        <MPLayout mt={mt} ml={ml ?? (bold ? 5 : 3)}>
            <Typography
                type={bold ? 'num16' : 'label14'}
                customColor={color ?? COLORS.TEXT.Primary}
                style={styles.sign}
            >
                ₽
            </Typography>
        </MPLayout>
    )
})
