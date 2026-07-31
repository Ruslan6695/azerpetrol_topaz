import { ReactElement, memo } from 'react'
import { DimensionValue, StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SPACING } from '../../common/config/constants/SPACING'
import { SIZES } from '../../common/config/constants/sizes'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { ThemeStore } from '../../common/model/themeStore'
import { Glass } from '../../GlassCard'
import { Typography } from '../../Typography'

type TBlockTypes = 'error' | 'warning' | 'info' | 'success'

type Props = {
    type: TBlockTypes
    text: string
    icon?: ReactElement
    styled?: {
        marginsPaddings?: IMarginsPaddings
        width?: {
            /** Число — единицы макета (домножаются на SIZES.PX), строка — процент */
            value: number | `${number}%`
            type?: 'px' | 'absolute'
        }
    }
}

const GLYPHS: Record<TBlockTypes, string> = {
    success: '✓',
    error: '!',
    warning: '!',
    info: 'i',
}

// Встроенный статус-баннер: то же стекло и тот же кружок статуса, что у тоста
// (shared/ToastComponent), но в потоке страницы, а не поверх неё.
export const ToastBlock = memo(({ styled, type, text, icon }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const accent =
        type === 'success'
            ? COLORS.STATE.Positive
            : type === 'warning'
              ? COLORS.STATE.Warning
              : type === 'info'
                ? COLORS.ACCENT.Primary
                : COLORS.STATE.Destructive

    const accentSoft =
        type === 'success'
            ? COLORS.STATE.PositiveSoft
            : type === 'warning'
              ? COLORS.STATE.WarningSoft
              : type === 'info'
                ? COLORS.GLASS.Secondary
                : COLORS.STATE.DestructiveSoft

    const width: DimensionValue =
        styled?.width === undefined
            ? SIZES.WIDTH(0.85)
            : typeof styled.width.value === 'number'
              ? styled.width.value * SIZES.PX
              : styled.width.value

    const mp = styled?.marginsPaddings

    const styles = StyleSheet.create({
        wrapper: {
            width,
            marginTop: (mp?.mt ?? 0) * SIZES.PX,
            marginBottom: (mp?.mb ?? 0) * SIZES.PX,
            marginRight: (mp?.mr ?? 0) * SIZES.PX,
            marginLeft: (mp?.ml ?? 0) * SIZES.PX,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.MD * SIZES.PX,
            paddingVertical: SPACING.LG * SIZES.PX,
            paddingHorizontal: SPACING.XL * SIZES.PX,
        },
        circle: {
            width: 28 * SIZES.PX,
            height: 28 * SIZES.PX,
            borderRadius: RADII.PILL,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: accentSoft,
        },
        text: {
            flex: 1,
        },
    })

    return (
        <View style={styles.wrapper}>
            <Glass level="primary" radius={RADII.ROW * SIZES.PX}>
                <View style={styles.row}>
                    <View style={styles.circle}>
                        {icon ?? (
                            <Typography type="label13" customColor={accent}>
                                {GLYPHS[type]}
                            </Typography>
                        )}
                    </View>

                    <View style={styles.text}>
                        <Typography type="body14">{text}</Typography>
                    </View>
                </View>
            </Glass>
        </View>
    )
})
