import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, SPACING } from '../../../../shared'
import { Chip } from '../../../../shared/Chip'
import { LITERS_PRESETS } from '../config/constants/LITERS'

type Props = {
    liters: number
    tankVolume: number
    onSelect: (liters: number) => void
}

// Чипы-пресеты объёма (dc.html:545–550).
export const LitersPresets = memo(({ liters, tankVolume, onSelect }: Props) => {
    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.SM * SIZES.PX,
        },
    })

    const handleSelectFull = useCallback(() => {
        onSelect(tankVolume)
    }, [tankVolume, onSelect])

    return (
        <View style={styles.row}>
            {LITERS_PRESETS.filter((preset) => preset <= tankVolume).map(
                (preset) => (
                    <LitersPresetChip
                        key={preset}
                        preset={preset}
                        selected={liters === preset}
                        onSelect={onSelect}
                    />
                )
            )}
            <Chip
                label="Полный бак"
                selected={liters === tankVolume}
                onPress={handleSelectFull}
            />
        </View>
    )
})

type ChipProps = {
    preset: number
    selected: boolean
    onSelect: (liters: number) => void
}

const LitersPresetChip = memo(({ preset, selected, onSelect }: ChipProps) => {
    const handlePress = useCallback(() => {
        onSelect(preset)
    }, [preset, onSelect])

    return (
        <Chip label={`${preset} л`} selected={selected} onPress={handlePress} />
    )
})
