import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

type Props = {}

// Высота строки топлива: бейдж 42 + paddingVertical 16×2 — как в ценах.
const ROW_HEIGHT = 74
const ROWS_COUNT = 4

export const SelectTrkTypeFormSkeleton = memo((props: Props) => {
    const styles = StyleSheet.create({
        list: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <View style={styles.list}>
            {Array.from({ length: ROWS_COUNT }).map((_, index) => (
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
