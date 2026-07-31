import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SPACING } from '../../common/config/constants/SPACING'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { Glass } from '../../GlassCard'
import { Typography } from '../../Typography'
import { TToastTypes } from '../config/types/TToastTypes'

type Props = {
    type: TToastTypes
    text: string
}

// Глиф вместо svg: иконки статусов в наборе «21 Век» отсутствуют, а старые
// assets были залиты hardcoded fill="white" и на стекле в светлой теме
// становились невидимыми. Тот же приём уже применён в shared/CenteredState.
const GLYPHS: Record<TToastTypes, string> = {
    success: '✓',
    error: '!',
    warning: '!',
}

// Тостов в макете нет — вид выведен из языка дизайна: та же стеклянная
// поверхность переднего плана, что у карточек, плюс кружок статуса.
export const ToastBody = memo(({ type, text }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const accent =
        type === 'success'
            ? COLORS.STATE.Positive
            : type === 'warning'
              ? COLORS.STATE.Warning
              : COLORS.STATE.Destructive

    const accentSoft =
        type === 'success'
            ? COLORS.STATE.PositiveSoft
            : type === 'warning'
              ? COLORS.STATE.WarningSoft
              : COLORS.STATE.DestructiveSoft

    const styles = StyleSheet.create({
        wrapper: {
            width: SIZES.WIDTH(0.9),
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
            <Glass level="secondary" radius={RADII.ROW * SIZES.PX}>
                <View style={styles.row}>
                    <View style={styles.circle}>
                        <Typography type="label13" customColor={accent}>
                            {GLYPHS[type]}
                        </Typography>
                    </View>

                    <View style={styles.text}>
                        <Typography type="body14">{text}</Typography>
                    </View>
                </View>
            </Glass>
        </View>
    )
})
