import { memo } from 'react'
import { StyleSheet } from 'react-native'
import { RADII, SIZES } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

// Высота строки: паддинги 16×2 + миниатюра 48.
const ROW_HEIGHT = 80

const styles = StyleSheet.create({
    row: {
        borderRadius: RADII.ROW * SIZES.PX,
    },
})

export const CoffeeMachineRowSkeleton = memo(() => {
    return (
        <Skeleton
            height={ROW_HEIGHT * SIZES.PX}
            width={SIZES.WIDTH(1) - 40 * SIZES.PX}
            style={styles.row}
        />
    )
})
