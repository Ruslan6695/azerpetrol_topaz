import { memo, useCallback } from 'react'
import { CustomText } from '../../../../shared/CustomText'
import { SelectAzsAndColumn } from '../../../../features/Fuel/SelectAzsAndColumnForm'
import { GetLocationOfAzs } from '../../../../features/Fuel/GetLocationOfAzs'
import { FuelStore, IAzs, IColumn } from '../../../../shared'
import { MapInfoBlocks } from '../../../../features/MapInfoBlocks'
import { FUEL_SELECT_AZS_AND_COLUMN_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_SELECT_AZS_AND_COLUMN_WIDGET_INFO_TEXTS'

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

export const FuelSelectAzsAndColumnWidget = memo(({ setRoad }: Props) => {
    const fuelStore = FuelStore.useState()
    const handleChangeAzs = FuelStore.useChangeAzs()
    const handleChangeColumn = FuelStore.useChangeColumn()

    const handleGoBack = useCallback(() => {
        setRoad('main')
    }, [])

    const handleSelectAzsAndColumn = useCallback(
        ({ azs, column }: { azs: IAzs; column: IColumn }) => {
            handleChangeAzs(azs)
            handleChangeColumn(column)
            setRoad('selectTrkType')
        },
        []
    )
    const handleSelectGeoAzs = useCallback(
        (azs: IAzs) => {
            if (!fuelStore.azs) {
                handleChangeAzs(azs)
            }
        },
        [fuelStore.azs]
    )

    return (
        <>
            <GetLocationOfAzs onChangeAzs={handleSelectGeoAzs} />
            <SelectAzsAndColumn
                onGoBack={handleGoBack}
                column={fuelStore.column}
                onSelectAzsAndColumn={handleSelectAzsAndColumn}
                azs={fuelStore.azs}
            />
            <MapInfoBlocks
                infoBlocks={FUEL_SELECT_AZS_AND_COLUMN_WIDGET_INFO_TEXTS}
            />
        </>
    )
})
