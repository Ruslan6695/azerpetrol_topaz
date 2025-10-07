import { memo } from 'react'
import {
    FuelPricesPriceBlock,
    IFuelPricesPriceBlock,
} from '../../../../entities/FuelPrices/FuelPricesPriceBlock'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'

type Props = {
    fuelPrices: IFuelPricesPriceBlock[]
}

export const MapFuelPricesPriceBlocks = memo(({ fuelPrices }: Props) => {
    return (
        <View style={styled.container}>
            {fuelPrices.map((pr) => (
                <FuelPricesPriceBlock key={pr.id} {...pr} />
            ))}
        </View>
    )
})

const styled = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10 * SIZES.PX,
        alignItems: 'center',
        width: '100%',
    },
})
