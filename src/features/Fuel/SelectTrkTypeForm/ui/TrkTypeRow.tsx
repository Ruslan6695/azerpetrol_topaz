import { memo, useCallback } from 'react'
import { FuelPriceRow } from '../../../../entities/Fuel/FuelPriceRow'
import { IFuelOption } from '../../../../shared'

type Props = {
    fuelOption: IFuelOption
    onSelect: (fuelOption: IFuelOption) => void
}

export const TrkTypeRow = memo(({ fuelOption, onSelect }: Props) => {
    const handlePress = useCallback(() => {
        onSelect(fuelOption)
    }, [fuelOption, onSelect])

    return (
        <FuelPriceRow
            name={fuelOption.name}
            price={fuelOption.price}
            discount={fuelOption.discount}
            cashback={fuelOption.cashback}
            bonus={fuelOption.bonus}
            unit="₽/л"
            onPress={handlePress}
        />
    )
})
