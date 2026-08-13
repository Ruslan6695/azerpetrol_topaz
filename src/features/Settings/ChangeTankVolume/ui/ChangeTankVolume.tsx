import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    FuelStore,
    MAX_TANK_VOLUME,
    MIN_TANK_VOLUME,
    RADII,
    SIZES,
    SPACING,
    TANK_VOLUME_PRESETS,
} from '../../../../shared'
import { AmountField } from '../../../../shared/AmountField'
import { Chip } from '../../../../shared/Chip'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'

// Объём бака хранится только на устройстве: в API такого поля нет.
export const ChangeTankVolume = memo(() => {
    const tankVolume = FuelStore.useTankVolume()
    const changeTankVolume = FuelStore.useChangeTankVolume()

    const handleSelectPreset = useCallback(
        (preset: number) => () => changeTankVolume(preset),
        [changeTankVolume]
    )

    const styles = StyleSheet.create({
        amount: {
            marginTop: SPACING.SM * SIZES.PX,
        },
        chips: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.SM * SIZES.PX,
            marginTop: SPACING.LG * SIZES.PX,
        },
        hint: {
            marginTop: SPACING.MD * SIZES.PX,
        },
    })

    return (
        <GlassCard
            variant="glass2"
            radius={RADII.CARD}
            paddingTop={22}
            paddingHorizontal={SPACING.SCREEN}
            paddingBottom={18}
        >
            <Typography type="rowTitle">Объём бака</Typography>

            <AmountField
                value={tankVolume}
                onChangeValue={changeTankVolume}
                suffix="л"
                min={MIN_TANK_VOLUME}
                max={MAX_TANK_VOLUME}
                style={styles.amount}
            />

            <View style={styles.chips}>
                {TANK_VOLUME_PRESETS.map((preset) => (
                    <Chip
                        key={preset}
                        label={`${preset} л`}
                        selected={tankVolume === preset}
                        onPress={handleSelectPreset(preset)}
                    />
                ))}
            </View>

            <View style={styles.hint}>
                <Typography type="caption12" color="secondary">
                    Пригодится, чтобы быстро выбрать литры при наливе.
                </Typography>
            </View>
        </GlassCard>
    )
})
