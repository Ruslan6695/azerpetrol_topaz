import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { CoffeeItemSkeleton } from '../../../../entities/Coffee/CoffeeItem'
import { SIZES, SPACING } from '../../../../shared'

const PLACEHOLDERS = [1, 2, 3, 4, 5, 6]

export const MapCoffeeItemsSkeleton = memo(() => {
    return (
        <View style={styles.container}>
            {PLACEHOLDERS.map((item) => (
                <CoffeeItemSkeleton key={item} />
            ))}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.MD * SIZES.PX,
    },
})
