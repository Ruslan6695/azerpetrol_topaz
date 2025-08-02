import { memo } from 'react'
import { SIZES, useFetchData } from '../../../../shared'
import {
    IMyCoffeeItem,
    MyCoffeeItem,
} from '../../../../entities/Coffee/MyCoffeeItem'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
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
                <CustomText fz={11} textAlign="center">
                    Кофе из списка активно 24 часа с момента приобритения
                </CustomText>
                {coffee ? (
                    coffee.length == 0 ? (
                        <CustomText
                            secondary
                            marginsPaddings={{ mt: 100 }}
                            textAlign="center"
                        >
                            НЕТ АКТИВНЫХ КОФЕ
                        </CustomText>
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
        gap: SIZES.PX * 10,
        marginBottom: SIZES.PX * 20,
    },
})
