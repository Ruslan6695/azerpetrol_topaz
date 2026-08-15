import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    IMyCoffeeItem,
    MyCoffeeItem,
} from '../../../../entities/Coffee/MyCoffeeItem'
import { SIZES, SPACING } from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { Icon } from '../../../../shared/Icons'
import { ListGroup } from '../../../../shared/ListRow'
import { Typography } from '../../../../shared/Typography'
import { MapMyCoffeeItemsSkeleton } from './MapMyCoffeeItemsSkeleton'

type Props = {
    coffee: IMyCoffeeItem[] | undefined
    onChangeSelectedCoffee: (coffee: IMyCoffeeItem) => void
    selectedCoffeeId: number | undefined
}

// Группа строк макета (dc.html:220–227): стеклянная карточка без внутреннего
// паддинга, строки внутри разделены линиями.
export const MapMyCoffeeItems = memo(
    ({ coffee, onChangeSelectedCoffee, selectedCoffeeId }: Props) => {
        if (!coffee) {
            return <MapMyCoffeeItemsSkeleton />
        }

        if (coffee.length === 0) {
            return (
                <CenteredState
                    variant="empty"
                    icon={<Icon name="home_coffee" size={44} />}
                    title="Нет активных кофе"
                    description="Купленные напитки появятся здесь и будут доступны 24 часа"
                />
            )
        }

        return (
            <View style={styles.container}>
                <Typography type="label14" marginsPaddings={{ ml: SPACING.XS }}>
                    Вы покупали за 24 часа
                </Typography>
                <ListGroup>
                    {coffee.map((item, index) => (
                        <MyCoffeeItem
                            isSelected={item.id === selectedCoffeeId}
                            last={index === coffee.length - 1}
                            onPress={onChangeSelectedCoffee}
                            {...item}
                            key={item.id}
                        />
                    ))}
                </ListGroup>
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        gap: SPACING.ROW_GAP * SIZES.PX,
    },
})
