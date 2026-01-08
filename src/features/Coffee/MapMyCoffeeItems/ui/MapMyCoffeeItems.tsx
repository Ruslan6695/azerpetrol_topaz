import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    IMyCoffeeItem,
    MyCoffeeItem,
} from '../../../../entities/Coffee/MyCoffeeItem'
import { SIZES } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'
import { MapMyCoffeeItemsSkeleton } from './MapMyCoffeeItemsSkeleton'

type Props = {
    coffee: IMyCoffeeItem[] | undefined
    onChangeSelectedCoffee: (coffee: IMyCoffeeItem) => void
    selectedCoffeeId: number | undefined
}

export const MapMyCoffeeItems = memo(
    ({ coffee, onChangeSelectedCoffee, selectedCoffeeId }: Props) => {
        return (
            <View style={styles.container}>
                <Typography
                    marginsPaddings={{ mb: 2 }}
                    color="secondary"
                    type="displaySmall"
                >
                    Вы покупали за 24 часа
                </Typography>
                {coffee ? (
                    coffee.length == 0 ? (
                        <Typography
                            color="secondary"
                            type="caption"
                            marginsPaddings={{ mt: 70 }}
                            textAlign="center"
                        >
                            НЕТ АКТИВНЫХ КОФЕ
                        </Typography>
                    ) : (
                        coffee?.map((coffee) => (
                            <MyCoffeeItem
                                isSelected={coffee.id === selectedCoffeeId}
                                onPress={onChangeSelectedCoffee}
                                {...coffee}
                                key={coffee.id}
                            />
                        ))
                    )
                ) : (
                    <MapMyCoffeeItemsSkeleton />
                )}
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        gap: SIZES.PX * 16,
        marginBottom: SIZES.PX * 20,
    },
})
