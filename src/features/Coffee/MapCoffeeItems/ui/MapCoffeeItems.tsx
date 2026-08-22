import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { CoffeeItem, ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { SIZES, SPACING } from '../../../../shared'
import { StaggerItem, useStagger } from '../../../../shared/Stagger'
import { MapCoffeeItemsSkeleton } from './MapCoffeeItemsSkeleton'

type Props = {
    items: ICoffeeItem[] | undefined
    isItemsLoading: boolean
    onBuyCoffee: (coffee: ICoffeeItem) => void
    bonus?: boolean
}

// Сетка макета — display:grid в две колонки. В RN её заменяет
// flexWrap: ширину плитки считает сам CoffeeItem.
export const MapCoffeeItems = memo(
    ({ items, isItemsLoading, onBuyCoffee, bonus }: Props) => {
        const getEntering = useStagger()

        if (isItemsLoading) {
            return <MapCoffeeItemsSkeleton />
        }
        return (
            <View style={styles.container}>
                {items?.map((item, index) => (
                    <StaggerItem key={item.id} entering={getEntering(index)}>
                        <CoffeeItem
                            bonus={bonus}
                            onPress={onBuyCoffee}
                            {...item}
                        />
                    </StaggerItem>
                ))}
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.MD * SIZES.PX,
    },
})
