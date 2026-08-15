import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING, ThemeStore } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'

type Props = {
    title: string
}

const CIRCLE_SIZE = 72

// Шапка итогов (dc.html:587–590): лаймовый круг 72 с «✓» и заголовок.
// CenteredState сюда не подходит — он центрируется по flex на весь экран,
// а здесь это верхний блок обычной колонки.
export const FuelLoadingResultHeader = memo(({ title }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            gap: SPACING.ROW_GAP * SIZES.PX,
            paddingTop: SPACING.ROW_GAP * SIZES.PX,
            paddingBottom: SPACING.XS * SIZES.PX,
        },
        circle: {
            width: CIRCLE_SIZE * SIZES.PX,
            height: CIRCLE_SIZE * SIZES.PX,
            borderRadius: RADII.PILL,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.ACCENT.Lime,
        },
    })

    return (
        <View style={styles.container}>
            <View style={styles.circle}>
                <Typography type="h2" customColor={COLORS.ACCENT.OnLime}>
                    ✓
                </Typography>
            </View>
            <Typography type="h6" textAlign="center">
                {title}
            </Typography>
        </View>
    )
})
