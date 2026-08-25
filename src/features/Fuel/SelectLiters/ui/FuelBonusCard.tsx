import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    calcFuelModifierAmount,
    collectFuelModifiers,
    formatFuelModifierAmount,
    IFuelOption,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'

type Props = {
    fuelOption: IFuelOption
    liters: number
}

const ICON_SIZE = 30

export const FuelBonusCard = memo(({ fuelOption, liters }: Props) => {
    const lines = useMemo(
        () =>
            collectFuelModifiers(fuelOption, [
                'bonus',
                'cashback',
                'discount',
            ]).map(({ kind, modifier }) => ({
                kind,
                text: formatFuelModifierAmount(
                    kind,
                    calcFuelModifierAmount(modifier, fuelOption.price, liters)
                ),
            })),
        [fuelOption, liters]
    )

    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.LG * SIZES.PX,
        },
        icon: {
            width: ICON_SIZE * SIZES.PX,
            alignItems: 'center',
        },
        texts: {
            flex: 1,
        },
    })

    if (!lines.length) {
        return null
    }

    const [main, ...rest] = lines

    return (
        <GlassCard
            variant="bonus"
            radius={RADII.CARD}
            paddingVertical={SPACING.XL}
            paddingHorizontal={18}
        >
            <View style={styles.row}>
                <View style={styles.icon}>
                    {main.kind === 'cashback' ? (
                        <Typography type="h3" customColor={COLORS.TEXT.Primary}>
                            ₽
                        </Typography>
                    ) : (
                        <Icon name="bonus" size={ICON_SIZE} />
                    )}
                </View>
                <View style={styles.texts}>
                    <Typography type="label14">{main.text}</Typography>
                    {rest.map((line) => (
                        <Typography
                            key={line.kind}
                            type="caption12"
                            color="secondary"
                            marginsPaddings={{ mt: 2 }}
                        >
                            {line.text}
                        </Typography>
                    ))}
                </View>
            </View>
        </GlassCard>
    )
})
