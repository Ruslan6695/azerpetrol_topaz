import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

type Props = {
    /** Сколько плашек показать: список АЗС — четыре, поле колонки — одна */
    rows?: number
}

// Высота плашки повторяет FuelListRow: паддинги 16×2 + строка 20.
const ROW_HEIGHT = 52
const ROWS_COUNT = 4

export const SelectAzsAndColumnSkeleton = memo(({ rows }: Props) => {
    const styles = StyleSheet.create({
        list: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <View style={styles.list}>
            {Array.from({ length: rows ?? ROWS_COUNT }).map((_, index) => (
                <Skeleton
                    key={index}
                    height={ROW_HEIGHT * SIZES.PX}
                    width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                    style={{ borderRadius: RADII.ROW * SIZES.PX }}
                />
            ))}
        </View>
    )
})
