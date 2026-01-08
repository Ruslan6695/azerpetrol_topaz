import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import BottomSheet from '../../../../shared/BottomSheet/ui/BottomSheet'
import { COLORS, SIZES } from '../../../../shared'
import {
    SelectCoffeeMachine,
    SelectCoffeeMachineButton,
} from '../../../../features/Coffee/SelectCoffeeMachine'
import {
    ScanCoffeeMachine,
    ScanCoffeeMachineButton,
} from '../../../../features/Coffee/ScanCoffeeMachine'
import { MapInfoBlocks } from '../../../../features/MapInfoBlocks'
import {
    SELECT_COFFEE_MACHINES_INFO_TEXTS,
    SELECT_COFFEE_MACHINES_SCAN_INFO_TEXTS,
    SELECT_COFFEE_MACHINES_WIDGET_INFO_TEXTS,
} from '../config/constants/SELECT_COFFEE_MACHINES_WIDGET_INFO_TEXTS'
import { Typography } from '../../../../shared/Typography'

type Props = {
    onSelectCoffeeMachineId: (id: number) => void
}

export const SelectCoffeeMachineWidget = ({
    onSelectCoffeeMachineId,
}: Props) => {
    const [selectedType, setSelectedType] = useState<'scan' | 'select' | null>(
        null
    )
    const handlePressOnSelect = () => {
        setSelectedType('select')
    }
    const handlePressOnScan = () => {
        setSelectedType('scan')
    }

    const handleGoBack = useCallback(() => {
        setSelectedType(null)
    }, [])

    const handleScann = useCallback((text: string) => {
        const splittedtext = text.split('=')
        if (
            splittedtext.length == 2 &&
            splittedtext[0] === 'coffee_machine_id'
        ) {
            onSelectCoffeeMachineId(+splittedtext[1])
        }
    }, [])

    return (
        <>
            <Typography marginsPaddings={{ mb: 15 }} textAlign="center">
                {selectedType === 'scan'
                    ? 'Просканируйте QR с кофемашины'
                    : 'Выберите кофемашину'}
            </Typography>
            {selectedType === 'select' ? (
                <>
                    <SelectCoffeeMachine
                        onSelect={onSelectCoffeeMachineId}
                        onGoBack={handleGoBack}
                    />
                    <MapInfoBlocks
                        infoBlocks={SELECT_COFFEE_MACHINES_INFO_TEXTS}
                    />
                </>
            ) : selectedType === 'scan' ? (
                <>
                    <ScanCoffeeMachine
                        onGoBack={handleGoBack}
                        onScan={handleScann}
                    />
                    <MapInfoBlocks
                        infoBlocks={SELECT_COFFEE_MACHINES_SCAN_INFO_TEXTS}
                    />
                </>
            ) : (
                <View style={styles.container}>
                    <View style={styles.flex}>
                        <ScanCoffeeMachineButton onPress={handlePressOnScan} />
                        <SelectCoffeeMachineButton
                            onPress={handlePressOnSelect}
                        />
                    </View>

                    <MapInfoBlocks
                        infoBlocks={SELECT_COFFEE_MACHINES_WIDGET_INFO_TEXTS}
                    />
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {},
    flex: {
        gap: 15 * SIZES.PX,
    },
})
