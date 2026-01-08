import { memo } from 'react'
import { MapFuelMainBlocks } from '../../../../features/Fuel/MapFuelMainBlocks'
import { MapInfoBlocks } from '../../../../features/MapInfoBlocks'
import { FUEL_MAIN_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_MAIN_WIDGET_INFO_TEXTS'
import { useNavigation, useRouter } from 'expo-router'
import { ESCREENS } from '../../../../shared'
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

export const FuelMainWidget = memo(({ setRoad }: Props) => {
    const router = useRouter()
    const onSelectColumn = () => {
        setRoad('selectAzsAndColumn')
    }

    const onScanColumn = () => {
        setRoad('scan')
    }

    const onNeedHelp = () => {
        router.navigate(ESCREENS.HELP)
    }

    return (
        <>
            <ScreenTitle title="Выберите метод" />
            <MapFuelMainBlocks
                onNeedHelp={onNeedHelp}
                onScanColumn={onScanColumn}
                onSelectColumn={onSelectColumn}
            />
            <MapInfoBlocks infoBlocks={FUEL_MAIN_WIDGET_INFO_TEXTS} />
        </>
    )
})
