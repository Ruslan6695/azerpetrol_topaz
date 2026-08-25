import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { SelectLiters } from '../../../../features/Fuel/SelectLiters'
import {
    ESCREENS,
    FuelStore,
    SIZES,
    SPACING,
    TFuelRoad,
} from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { FUEL_SELECT_LITERS_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_SELECT_LITERS_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
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
        [changeLitersAndRubles, router]
    )

    const handleGoBack = useCallback(() => {
        setRoad('selectTrkType')
    }, [setRoad])

    // Шаг открыт без выбранного топлива — возвращаемся назад.
    // Именно в эффекте: setRoad во время рендера ронял порядок хуков.
    const isReady = Boolean(
        fuelStore.azs && fuelStore.column && fuelStore.fuelOption
    )
    useEffect(() => {
        if (!isReady) {
            setRoad('selectTrkType')
        }
    }, [isReady, setRoad])

    const styles = StyleSheet.create({
        info: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    if (!fuelStore.azs || !fuelStore.column || !fuelStore.fuelOption) {
        return null
    }

    return (
        <>
            <SelectLiters
                onGoBack={handleGoBack}
                onSubmit={handleChangeLitersAndRubles}
                azs={fuelStore.azs}
                column={fuelStore.column}
                fuelOption={fuelStore.fuelOption}
            />
            <MPLayout mt={SPACING.SECTION}>
                <View style={styles.info}>
                    {FUEL_SELECT_LITERS_WIDGET_INFO_TEXTS.map((info) => (
                        <InfoCard key={info.title} {...info} />
                    ))}
                </View>
            </MPLayout>
        </>
    )
})
