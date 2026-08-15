import { memo, useCallback, useEffect, useState } from 'react'
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
    /** Дробное значение с шагом 0.5 (литры). По умолчанию только целые */
    decimal?: boolean
    /** Цвет числа и суффикса. По умолчанию TEXT.Primary / secondary */
    color?: string
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
        decimal,
        color,
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
                color: color ?? COLORS.TEXT.Primary,
            },
            suffix: {
                paddingBottom: 4 * SIZES.PX,
            },
        })

        // В дробном режиме поле держит собственный текст: если показывать
        // разобранное число, набранная точка («20.») тут же пропадала бы.
        const [text, setText] = useState(String(value))

        useEffect(() => {
            if (!decimal) {
                return
            }
            // Значение пришло снаружи (слайдер, чипы) — перебиваем набранное.
            if (parseFloat(text) !== value) {
                setText(String(value))
            }
        }, [value, decimal])

        // Из ввода остаются только цифры (и точка в дробном режиме),
        // результат зажимается в [min, max]: иначе в запрос может уйти
        // значение, которое бэкенд не примет.
        const handleChangeText = useCallback(
            (next: string) => {
                const cleaned = decimal
                    ? next.replace(',', '.').replace(/[^\d.]/g, '')
                    : next.replace(/\D/g, '')
                const parsed = decimal
                    ? parseFloat(cleaned)
                    : parseInt(cleaned, 10)

                if (decimal) {
                    setText(cleaned)
                    // Нижнюю границу применяем на потере фокуса: иначе
                    // «0.5» при min = 1 не дать набрать.
                    if (!isNaN(parsed)) {
                        onChangeValue(
                            max !== undefined ? Math.min(max, parsed) : parsed
                        )
                    }
                    return
                }

                const value = isNaN(parsed) ? min : parsed
                onChangeValue(
                    max !== undefined
                        ? Math.max(min, Math.min(max, value))
                        : Math.max(min, value)
                )
            },
            [min, max, decimal, onChangeValue]
        )

        const handleBlur = useCallback(() => {
            if (!decimal) {
                return
            }
            const parsed = parseFloat(text)
            const bounded = Math.max(min, isNaN(parsed) ? min : parsed)
            setText(String(bounded))
            onChangeValue(bounded)
        }, [decimal, text, min, onChangeValue])

        return (
            <View style={[styles.field, style]}>
                <TextInput
                    value={decimal ? text : String(value)}
                    onChangeText={handleChangeText}
                    onBlur={handleBlur}
                    keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
                    selectTextOnFocus
                    style={styles.input}
                />
                {suffix ? (
                    <View style={styles.suffix}>
                        <Typography
                            type="num18"
                            color={color ? undefined : 'secondary'}
                            customColor={color}
                        >
                            {suffix}
                        </Typography>
                    </View>
                ) : null}
            </View>
        )
    }
)
