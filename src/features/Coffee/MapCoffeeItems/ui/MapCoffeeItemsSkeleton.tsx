import { memo } from 'react'
import { SIZES } from '../../../../shared'
import { StyleSheet, View } from 'react-native'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { CoffeItemSkeleton } from '../../../../entities/Coffee/CoffeeItem'

type Props = {}

export const MapCoffeeItemsSkeleton = memo((props: Props) => {
    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <CoffeItemSkeleton key={item} />
            ))}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SIZES.PX * 20,
    },
})
