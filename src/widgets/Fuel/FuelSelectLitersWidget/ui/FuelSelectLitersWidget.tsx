import { memo, useCallback } from 'react'
import { SelectLiters } from '../../../../features/Fuel/SelectLiters'
import { ESCREENS, FuelStore } from '../../../../shared'
import { useRouter } from 'expo-router'
import { MapInfoBlocks } from '../../../../features/MapInfoBlocks'
import { FUEL_SELECT_LITERS_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_SELECT_LITERS_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<
        React.SetStateAction<
            | 'main'
            | 'selectAzsAndColumn'
            | 'scan'
            | 'selectTrkType'
            | 'selectLiters'
        >
    >
}

export const FuelSelectLitersWidget = memo(({ setRoad }: Props) => {
    const router = useRouter()
    const fuelStore = FuelStore.useState()
    const changeLitersAndRubles = FuelStore.useChangeLitersAndRubles()

    const handleChangeLitersAndRubles = useCallback(
        (props: { liters: number; rubles: number }) => {
            changeLitersAndRubles(props)
            router.navigate(ESCREENS.FUEL_LOADING)
        },
        []
    )

    const handleGoBack = useCallback(() => {
        setRoad('selectTrkType')
    }, [])

    if (!fuelStore.azs || !fuelStore.column || !fuelStore.trkType) {
        setRoad('selectTrkType')
        return <></>
    }

    return (
        <>
            <SelectLiters
                onGoBack={handleGoBack}
                onSubmit={handleChangeLitersAndRubles}
                azs={fuelStore.azs}
                column={fuelStore.column}
                trkType={fuelStore.trkType}
            />
            <MapInfoBlocks
                mt={20}
                infoBlocks={FUEL_SELECT_LITERS_WIDGET_INFO_TEXTS}
            />
        </>
    )
})
