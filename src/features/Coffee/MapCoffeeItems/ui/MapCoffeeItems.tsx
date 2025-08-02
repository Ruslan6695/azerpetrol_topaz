import { memo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { CoffeeItem, ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { SIZES } from '../../../../shared'
import { MapCoffeeItemsSkeleton } from './MapCoffeeItemsSkeleton'

type Props = {
    items: ICoffeeItem[] | undefined
    isItemsLoading: boolean
    onBuyCoffee: (coffee: ICoffeeItem) => void
    bonus?: boolean
}

export const MapCoffeeItems = memo(
    ({ items, isItemsLoading, onBuyCoffee, bonus }: Props) => {
        if (isItemsLoading) {
            return <MapCoffeeItemsSkeleton />
        }
        return (
            <View style={styles.container}>
                {items?.map((item) => (
                    <CoffeeItem
                        bonus={bonus}
                        onPress={onBuyCoffee}
                        {...item}
                        key={item.id}
                    />
                ))}
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SIZES.PX * 20,
        marginBottom: SIZES.PX * 20,
    },
})
