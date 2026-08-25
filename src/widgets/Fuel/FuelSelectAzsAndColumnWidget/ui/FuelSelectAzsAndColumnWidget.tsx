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
import { IAzsGeo } from '../../../../features/Fuel/GetLocationOfAzs/config/interfaces/IGetLocationOfAzsData'
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

    // Геолокация временно не подставляет станцию автоматически: get_azs_geo/
    // отдаёт легаси-числовой id, несовместимый с id станций Топаз (строка).
    // Автоподбор вернётся, когда появится эндпоинт геопоиска в новом контракте
    // (см. plans/topaz-fuelling-integration-design.md, открытые вопросы).
    const handleSelectGeoAzs = useCallback((_azs: IAzsGeo) => {}, [])

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
