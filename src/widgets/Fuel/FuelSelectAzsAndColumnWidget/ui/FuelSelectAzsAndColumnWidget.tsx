import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { GetLocationOfAzs } from '../../../../features/Fuel/GetLocationOfAzs'
import { SelectAzsAndColumn } from '../../../../features/Fuel/SelectAzsAndColumnForm'
import {
    FuelStore,
    IAzs,
    IColumn,
    SIZES,
    SPACING,
    TFuelRoad,
} from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { FUEL_SELECT_AZS_AND_COLUMN_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_SELECT_AZS_AND_COLUMN_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
}

export const FuelSelectAzsAndColumnWidget = memo(({ setRoad }: Props) => {
    const fuelStore = FuelStore.useState()
    const handleChangeAzs = FuelStore.useChangeAzs()
    const handleChangeColumn = FuelStore.useChangeColumn()

    const handleGoBack = useCallback(() => {
        setRoad('main')
    }, [setRoad])

    const handleSelectAzsAndColumn = useCallback(
        ({ azs, column }: { azs: IAzs; column: IColumn }) => {
            handleChangeAzs(azs)
            handleChangeColumn(column)
            setRoad('selectTrkType')
        },
        [handleChangeAzs, handleChangeColumn, setRoad]
    )

    const handleSelectGeoAzs = useCallback(
        (azs: IAzs) => {
            if (!fuelStore.azs) {
                handleChangeAzs(azs)
            }
        },
        [fuelStore.azs, handleChangeAzs]
    )

    const styles = StyleSheet.create({
        info: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <>
            <GetLocationOfAzs onChangeAzs={handleSelectGeoAzs} />
            <SelectAzsAndColumn
                onGoBack={handleGoBack}
                onSelectAzsAndColumn={handleSelectAzsAndColumn}
                azs={fuelStore.azs}
            />
            <MPLayout mt={SPACING.SECTION}>
                <View style={styles.info}>
                    {FUEL_SELECT_AZS_AND_COLUMN_WIDGET_INFO_TEXTS.map(
                        (info) => (
                            <InfoCard key={info.title} {...info} />
                        )
                    )}
                </View>
            </MPLayout>
        </>
    )
})
