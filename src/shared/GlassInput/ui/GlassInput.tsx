import { ReactNode, forwardRef } from 'react'
import { StyleSheet, TextInputProps, View } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { FONTS } from '../../common/config/constants/FONTS'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { Typography } from '../../Typography'

const DEFAULT_MASK =
    '******************************************************************************'

interface IProps extends TextInputProps {
    onChangeText: (text: string) => void
    label?: string
    error?: string
    icon?: ReactNode
    rightSlot?: ReactNode
    mask?: string
    /** Тип маски react-native-masked-text, по умолчанию 'custom' */
    maskType?: any
    /** В единицах макета, домножается на SIZES.PX */
    height?: number
}

// Поле ввода макета: стекло, рамка GLASS.Border, радиус 16, иконка слева.
// Логика маски и обрезки пробелов перенесена из CustomInput — оригинал
// остаётся на месте, его используют 13 существующих форм.
export const GlassInput = forwardRef((props: IProps, ref: any) => {
    const COLORS = ThemeStore.useCOLORS()
    const {
        label,
        error,
        icon,
        rightSlot,
        mask,
        maskType,
        height = 54,
        onChangeText,
        ...rest
    } = props

    const styles = StyleSheet.create({
        field: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10 * SIZES.PX,
            height: height * SIZES.PX,
            paddingHorizontal: 18 * SIZES.PX,
            borderRadius: RADII.INPUT * SIZES.PX,
            backgroundColor: COLORS.GLASS.Primary,
            borderWidth: 1,
            borderColor: error ? COLORS.STATE.Destructive : COLORS.GLASS.Border,
        },
        input: {
            flex: 1,
            height: '100%',
            fontSize: 15 * SIZES.PX,
            color: COLORS.TEXT.Primary,
            fontFamily: FONTS.SEMIBOLD,
        },
    })

    return (
        <View>
            {label && (
                <Typography type="caption12" color="secondary" marginsPaddings={{ mb: 6 }}>
                    {label}
                </Typography>
            )}

            <View style={styles.field}>
                {icon}
                <TextInputMask
                    ref={ref}
                    placeholderTextColor={COLORS.TEXT.Secondary}
                    type={maskType ?? 'custom'}
                    options={{ mask: mask ?? DEFAULT_MASK }}
                    style={styles.input}
                    {...rest}
                    onChangeText={(text) => {
                        // Числовая клавиатура на части устройств отдаёт запятую.
                        const normalized =
                            rest.keyboardType === 'numeric' &&
                            text[text.length - 1] === ','
                                ? text.replace(',', '.')
                                : text
                        onChangeText(normalized.replace(/ /g, ''))
                    }}
                />
                {rightSlot}
            </View>

            {error && (
                <Typography type="caption12" color="error" marginsPaddings={{ mt: 6 }}>
                    {error}
                </Typography>
            )}
        </View>
    )
})
