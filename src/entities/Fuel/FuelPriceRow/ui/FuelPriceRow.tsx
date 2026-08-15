import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    collectFuelModifiers,
    formatFuelModifier,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'
import { IFuelPriceRow } from '../config/interfaces/IFuelPriceRow'
import { formatPrice } from '../lib/formatPrice'
import { getFuelBadge } from '../lib/getFuelBadge'
import { FuelBadge } from './FuelBadge'

type Props = IFuelPriceRow

// Строка списка цен из макета (dc.html:364–367): бейдж марки, название,
// цена справа. Скидку и кэшбек макет не рисует — они приходят с бэкенда
// и дорисованы языком макета.
export const FuelPriceRow = memo(
    ({
        name,
        price,
        discount,
        cashback,
        bonus,
        unit = '₽',
        onPress,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const badge = useMemo(() => getFuelBadge(name), [name])

        // Скидка в этот список не входит: она видна по перечёркнутой цене.
        const modifiers = useMemo(
            () =>
                collectFuelModifiers({ cashback, bonus }, [
                    'cashback',
                    'bonus',
                ]).map(({ kind, modifier }) => ({
                    kind,
                    // Рубли в модификаторе — всегда за литр, поэтому подпись
                    // не зависит от unit строки («₽» на экране цен).
                    text: formatFuelModifier(kind, modifier, '₽/л'),
                })),
            [cashback, bonus]
        )

        const discountPrice = useMemo(() => {
            if (!discount) {
                return undefined
            }
            const value =
                discount.type === 'percent'
                    ? price - price * (discount.value / 100)
                    : price - discount.value
            return formatPrice(value)
        }, [discount, price])

        const styles = StyleSheet.create({
            row: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: SPACING.MD * SIZES.PX,
            },
            left: {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.MD * SIZES.PX,
            },
            titles: {
                flex: 1,
            },
            prices: {
                alignItems: 'flex-end',
            },
            oldPrice: {
                textDecorationLine: 'line-through',
            },
        })

        return (
            <GlassCard
                variant="glass2"
                radius={RADII.ROW}
                paddingVertical={SPACING.XL}
                paddingHorizontal={18}
                onPress={onPress}
            >
                <View style={styles.row}>
                    <View style={styles.left}>
                        <FuelBadge {...badge} />
                        <View style={styles.titles}>
                            <Typography type="rowTitle" numberOfLines={2}>
                                {name}
                            </Typography>
                            {modifiers.map(({ kind, text }) => (
                                <Typography
                                    key={kind}
                                    type="caption11"
                                    customColor={COLORS.STATE.Positive}
                                    marginsPaddings={{ mt: 2 }}
                                >
                                    {text}
                                </Typography>
                            ))}
                        </View>
                    </View>

                    <View style={styles.prices}>
                        {discountPrice ? (
                            <>
                                <Typography
                                    type="caption11"
                                    color="secondary"
                                    style={styles.oldPrice}
                                >
                                    {`${formatPrice(price)} ${unit}`}
                                </Typography>
                                <Typography
                                    type="num17"
                                    customColor={COLORS.ACCENT.Primary}
                                    marginsPaddings={{ mt: 2 }}
                                >
                                    {`${discountPrice} ${unit}`}
                                </Typography>
                            </>
                        ) : (
                            <Typography type="num17">
                                {`${formatPrice(price)} ${unit}`}
                            </Typography>
                        )}
                    </View>
                </View>
            </GlassCard>
        )
    }
)
