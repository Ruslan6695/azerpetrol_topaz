import { memo, useCallback } from 'react'
import { SelectTrkTypeForm } from '../../../../features/Fuel/SelectTrkTypeForm'
import { MapInfoBlocks } from '../../../../features/MapInfoBlocks'
import { FuelStore, ITrkType } from '../../../../shared'
import { FUEL_SELECT_TRK_TYPE_INFO_TEXTS } from '../config/constants/FUEL_MAIN_WIDGET_INFO_TEXTS'
import { ScreenTitle } from '../../../../entities/ScreenTitle'

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

export const FuelSelectTrkTypeWidget = memo(({ setRoad }: Props) => {
    const fuelStore = FuelStore.useState()
    const changeTrkType = FuelStore.useChangeTrkType()
    if (!fuelStore.azs || !fuelStore.column) {
        setRoad('selectAzsAndColumn')
        return <></>
    }

    const handleSelectTrkType = useCallback((trkType: ITrkType) => {
        changeTrkType(trkType)
        setRoad('selectLiters')
    }, [])

    const handleGoBack = useCallback(() => {
        setRoad('selectAzsAndColumn')
    }, [])
    return (
        <>
            <ScreenTitle title="Выберите тип топлива" />
            <SelectTrkTypeForm
                onGoBack={handleGoBack}
                selectedTrkType={fuelStore.trkType}
                onSelectTrkType={handleSelectTrkType}
                azs={fuelStore.azs}
                column={fuelStore.column}
            />
            <MapInfoBlocks infoBlocks={FUEL_SELECT_TRK_TYPE_INFO_TEXTS} />
        </>
    )
})
