import { useCallback, useState } from 'react'
import { FuelMainWidget } from '../../../widgets/Fuel/FuelMainWidget'
import { FuelSelectAzsAndColumnWidget } from '../../../widgets/Fuel/FuelSelectAzsAndColumnWidget'
import { FuelSelectTrkTypeWidget } from '../../../widgets/Fuel/FuelSelectTrkTypeWidget'
import { FuelSelectLitersWidget } from '../../../widgets/Fuel/FuelSelectLitersWidget'
import { useFocusEffect } from 'expo-router'
import { FuelScanBarcodeWidget } from '../../../widgets/Fuel/FuelScanBarcodeWidget'
import { useGetBalance } from '../../../shared'

type Props = {}

export const Fuel = (props: Props) => {
    const [road, setRoad] = useState<
        | 'main'
        | 'selectAzsAndColumn'
        | 'scan'
        | 'selectTrkType'
        | 'selectLiters'
    >('main')
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
        case 'scan':
            return <FuelScanBarcodeWidget setRoad={setRoad} />
    }
}
