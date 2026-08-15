import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

// Высота строки: паддинги 15×2 + миниатюра 40.
const ROW_HEIGHT = 70
const PLACEHOLDERS = [1, 2, 3]

const styles = StyleSheet.create({
    container: {
        gap: SPACING.ROW_GAP * SIZES.PX,
    },
    group: {
        borderRadius: RADII.CARD * SIZES.PX,
    },
})

export const MapMyCoffeeItemsSkeleton = memo(() => {
    return (
        <View style={styles.container}>
            <Skeleton
                height={16 * SIZES.PX}
                width={SIZES.WIDTH(0.5)}
                margins={{ ml: SPACING.XS }}
            />
            <Skeleton
                height={ROW_HEIGHT * PLACEHOLDERS.length * SIZES.PX}
                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                style={styles.group}
            />
        </View>
    )
})
