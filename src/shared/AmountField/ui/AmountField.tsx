import { memo, useCallback } from 'react'
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import { FONTS } from '../../common/config/constants/FONTS'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { ThemeStore } from '../../common/model/themeStore'
import { Typography } from '../../Typography'

type Props = {
    value: number
    onChangeValue: (value: number) => void
    /** Единица измерения справа от числа: '₽', 'B' и т.п. */
    suffix?: string
    /** 'left' — ширина по контенту (замена width: fit-content из макета) */
    align?: 'left' | 'center'
    /** Растянуть бокс на всю ширину родителя, не трогая выравнивание текста */
    fullWidth?: boolean
    /** В лестнице Typography нет 800/34, поэтому размер числа задаётся числом */
    fontSize?: number
    radius?: number
    minWidth?: number
    min?: number
    max?: number
    style?: StyleProp<ViewStyle>
}

// Бокс ввода суммы из макета: крупное число в акцентной рамке и суффикс валюты.
export const AmountField = memo(
    ({
        value,
        onChangeValue,
        suffix = '₽',
        align = 'left',
        fullWidth,
        fontSize = 34,
        radius = RADII.INPUT,
        minWidth = 130,
        min = 0,
        max,
        style,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            field: {
                flexDirection: 'row',
                // baseline в RN ведёт себя по-разному на iOS и Android,
                // поэтому число и суффикс выравниваются по нижнему краю
                alignItems: 'flex-end',
                gap: SPACING.XS * SIZES.PX,
                alignSelf:
                    fullWidth || align === 'center' ? 'stretch' : 'flex-start',
                justifyContent: align === 'center' ? 'center' : 'flex-start',
                backgroundColor: COLORS.GLASS.Primary,
                borderWidth: 1.5 * SIZES.PX,
                borderColor: COLORS.ACCENT.Primary,
                borderRadius: radius * SIZES.PX,
                paddingVertical: SPACING.SM * SIZES.PX,
                paddingHorizontal: SPACING.LG * SIZES.PX,
            },
            input: {
                // На всю ширину число занимает остаток строки,
                // а суффикс прижимается к правому краю бокса.
                flex: fullWidth ? 1 : undefined,
                minWidth: minWidth * SIZES.PX,
                padding: 0,
                textAlign: align === 'center' ? 'center' : 'left',
                fontFamily: FONTS.EXTRABOLD,
                fontSize: fontSize * SIZES.PX,
                color: COLORS.TEXT.Primary,
            },
            suffix: {
                paddingBottom: 4 * SIZES.PX,
            },
        })

        // Из ввода остаются только цифры, результат зажимается в [min, max]:
        // иначе в запрос может уйти сумма, которую бэкенд не примет.
        const handleChangeText = useCallback(
            (text: string) => {
                const parsed = parseInt(text.replace(/\D/g, ''), 10)
                const next = isNaN(parsed) ? min : parsed
                onChangeValue(
                    max !== undefined
                        ? Math.max(min, Math.min(max, next))
                        : Math.max(min, next)
                )
            },
            [min, max, onChangeValue]
        )

        return (
            <View style={[styles.field, style]}>
                <TextInput
                    value={String(value)}
                    onChangeText={handleChangeText}
                    keyboardType="number-pad"
                    selectTextOnFocus
                    style={styles.input}
                />
                {suffix ? (
                    <View style={styles.suffix}>
                        <Typography type="num18" color="secondary">
                            {suffix}
                        </Typography>
                    </View>
                ) : null}
            </View>
        )
    }
)
