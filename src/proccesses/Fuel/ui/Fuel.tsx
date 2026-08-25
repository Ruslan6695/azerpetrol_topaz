import { memo, useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { FuelMainWidget } from '../../../widgets/Fuel/FuelMainWidget'
import { FuelSelectAzsAndColumnWidget } from '../../../widgets/Fuel/FuelSelectAzsAndColumnWidget'
import { FuelSelectLitersWidget } from '../../../widgets/Fuel/FuelSelectLitersWidget'
import { FuelSelectTrkTypeWidget } from '../../../widgets/Fuel/FuelSelectTrkTypeWidget'
import { TFuelRoad, useGetBalance } from '../../../shared'

type Props = {}

export const Fuel = memo((props: Props) => {
    const [road, setRoad] = useState<TFuelRoad>('main')
    const { fetchBalance } = useGetBalance()

    useFocusEffect(
        useCallback(() => {
            fetchBalance({ args: undefined, hideToastOnError: true })
        }, [])
    )

    switch (road) {
        case 'main':
            return <FuelMainWidget setRoad={setRoad} />
        case 'selectAzsAndColumn':
            return <FuelSelectAzsAndColumnWidget setRoad={setRoad} />
        case 'selectTrkType':
            return <FuelSelectTrkTypeWidget setRoad={setRoad} />
        case 'selectLiters':
            return <FuelSelectLitersWidget setRoad={setRoad} />
    }
})
