import { memo, useCallback } from 'react'
import { FuelPriceRow } from '../../../../entities/Fuel/FuelPriceRow'
import { ITrkType } from '../../../../shared'

type Props = {
    trkType: ITrkType
    onSelect: (trkType: ITrkType) => void
}

// Обёртка над строкой цены: держит useCallback, чтобы в списке
// не создавать стрелочную функцию на каждый рендер.
export const TrkTypeRow = memo(({ trkType, onSelect }: Props) => {
    const handlePress = useCallback(() => {
        onSelect(trkType)
    }, [trkType, onSelect])

    return (
        <FuelPriceRow
            name={trkType.name}
            price={trkType.price}
            discount={trkType.discount}
            cashback={trkType.cashback}
            bonus={trkType.bonus}
            unit="₽/л"
            onPress={handlePress}
        />
    )
})
