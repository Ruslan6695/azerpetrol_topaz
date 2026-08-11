import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, ThemeStore } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'
import { TFuelBadge } from '../config/types/TFuelBadge'

type Props = TFuelBadge

// Бейдж марки топлива из макета (dc.html:365): прямоугольник 48×42
// с коротким кодом. Цвет — по виду топлива, в обеих темах одинаковый.
export const FuelBadge = memo(({ code, isDiesel }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        container: {
            width: 48 * SIZES.PX,
            height: 42 * SIZES.PX,
            borderRadius: RADII.BADGE * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDiesel
                ? COLORS.ACCENT.Diesel
                : COLORS.ACCENT.Lime,
        },
    })

    return (
        <View style={styles.container}>
            <Typography
                type="num12"
                customColor={COLORS.ACCENT.OnLime}
                numberOfLines={1}
            >
                {code}
            </Typography>
        </View>
    )
})
