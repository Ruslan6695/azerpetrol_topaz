import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'
import { COFFEE_ITEM_WIDTH } from './CoffeeItem'

const styles = StyleSheet.create({
    tile: {
        borderRadius: RADII.TILE * SIZES.PX,
    },
})

// Повторяет раскладку CoffeeItem: фото, название, цена.
export const CoffeeItemSkeleton = memo(() => {
    return (
        <View>
            <Skeleton
                height={154 * SIZES.PX}
                width={COFFEE_ITEM_WIDTH}
                style={styles.tile}
            />
            <Skeleton
                margins={{ mt: SPACING.ROW_GAP }}
                height={16 * SIZES.PX}
                width={COFFEE_ITEM_WIDTH * 0.7}
            />
            <Skeleton
                margins={{ mt: SPACING.SM }}
                height={16 * SIZES.PX}
                width={52 * SIZES.PX}
            />
        </View>
    )
})
