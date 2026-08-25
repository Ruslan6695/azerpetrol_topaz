import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { ScreenTitle } from '../../../../entities/ScreenTitle'
import { MapFuelMainBlocks } from '../../../../features/Fuel/MapFuelMainBlocks'
import { ESCREENS, SIZES, SPACING, TFuelRoad } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { FUEL_MAIN_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_MAIN_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
}

export const FuelMainWidget = memo(({ setRoad }: Props) => {
    const router = useRouter()

    const handleSelectColumn = useCallback(() => {
        setRoad('selectAzsAndColumn')
    }, [setRoad])

    const handleNeedHelp = useCallback(() => {
        router.navigate(ESCREENS.HELP)
    }, [router])

    const styles = StyleSheet.create({
        info: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <>
            <ScreenTitle title="Выберите метод" ml={SPACING.XS} />
            <MapFuelMainBlocks
                onNeedHelp={handleNeedHelp}
                onSelectColumn={handleSelectColumn}
            />
            <MPLayout mt={SPACING.SECTION}>
                <View style={styles.info}>
                    {FUEL_MAIN_WIDGET_INFO_TEXTS.map((info) => (
                        <InfoCard key={info.title} {...info} />
                    ))}
                </View>
            </MPLayout>
        </>
    )
})
