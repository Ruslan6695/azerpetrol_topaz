import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    calcFuelModifierAmount,
    collectFuelModifiers,
    formatFuelModifierAmount,
    ITrkType,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'

type Props = {
    trkType: ITrkType
    /** Модификаторы считаются от объёма: рубли в них — за литр */
    liters: number
}

const ICON_SIZE = 30

// Карточка выгоды (dc.html:556–559). Бонусы, кэшбек и скидка — разные вещи,
// поэтому у каждой свой текст; пока бэкенд их не отдаёт, карточки нет.
export const FuelBonusCard = memo(({ trkType, liters }: Props) => {
    const lines = useMemo(
        () =>
            collectFuelModifiers(trkType, [
                'bonus',
                'cashback',
                'discount',
            ]).map(({ kind, modifier }) => ({
                kind,
                text: formatFuelModifierAmount(
                    kind,
                    calcFuelModifierAmount(modifier, trkType.price, liters)
                ),
            })),
        [trkType, liters]
    )

    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.LG * SIZES.PX,
        },
        // Знак рубля рисуется текстом, поэтому фиксируем ему ширину иконки,
        // иначе тексты в карточках бонусов и кэшбека начинались бы по-разному.
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
                        <Typography type="h3" customColor={COLORS.Icon.Primary}>
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
