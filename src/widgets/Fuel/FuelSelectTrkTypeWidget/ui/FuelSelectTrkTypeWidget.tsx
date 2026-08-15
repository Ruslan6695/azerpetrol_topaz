import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { SelectTrkTypeForm } from '../../../../features/Fuel/SelectTrkTypeForm'
import {
    FuelStore,
    ITrkType,
    SIZES,
    SPACING,
    TFuelRoad,
} from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { FUEL_SELECT_TRK_TYPE_INFO_TEXTS } from '../config/constants/FUEL_SELECT_TRK_TYPE_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
}

export const FuelSelectTrkTypeWidget = memo(({ setRoad }: Props) => {
    const fuelStore = FuelStore.useState()
    const changeTrkType = FuelStore.useChangeTrkType()

    const handleSelectTrkType = useCallback(
        (trkType: ITrkType) => {
            changeTrkType(trkType)
            setRoad('selectLiters')
        },
        [changeTrkType, setRoad]
    )

    const handleGoBack = useCallback(() => {
        setRoad('selectAzsAndColumn')
    }, [setRoad])

    // Шаг открыт без выбранной колонки — возвращаемся назад.
    // Именно в эффекте: setRoad во время рендера ронял порядок хуков.
    const isReady = Boolean(fuelStore.azs && fuelStore.column)
    useEffect(() => {
        if (!isReady) {
            setRoad('selectAzsAndColumn')
        }
    }, [isReady, setRoad])

    const styles = StyleSheet.create({
        info: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    if (!fuelStore.azs || !fuelStore.column) {
        return null
    }

    return (
        <>
            <SelectTrkTypeForm
                onGoBack={handleGoBack}
                onSelectTrkType={handleSelectTrkType}
                azs={fuelStore.azs}
                column={fuelStore.column}
            />
            <MPLayout mt={SPACING.SECTION}>
                <View style={styles.info}>
                    {FUEL_SELECT_TRK_TYPE_INFO_TEXTS.map((info) => (
                        <InfoCard key={info.title} {...info} />
                    ))}
                </View>
            </MPLayout>
        </>
    )
})
