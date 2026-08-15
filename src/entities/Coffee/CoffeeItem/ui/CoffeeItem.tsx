import { memo, useCallback, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import {
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    divideNumber,
} from '../../../../shared'
import { BonusIcon } from '../../../../shared/BonusIcon'
import { Chip } from '../../../../shared/Chip'
import { GlassCard } from '../../../../shared/GlassCard'
import { NoImageIcon } from '../../../../shared/Icons/NoImageIcon'
import { Typography } from '../../../../shared/Typography'
import { ICoffeeItem } from '../config/interfaces/ICoffeeItem'

interface IProps extends ICoffeeItem {
    onPress: (coffee: ICoffeeItem) => void
    bonus?: boolean
}

// Ширина плитки в сетке из двух колонок: экран минус паддинги обёртки (20×2)
// минус зазор между колонками (SPACING.MD), пополам.
const COLUMN_GAP = SPACING.MD
export const COFFEE_ITEM_WIDTH =
    SIZES.WIDTH(0.5) - (20 + COLUMN_GAP / 2) * SIZES.PX

const IMAGE_BOX_HEIGHT = 130
const IMAGE_SIZE = 104
// Отбивка цены (и чипа «Бесплатно») от названия. В макете она меньше
// SPACING.SM — своего токена под неё нет.
const PRICE_MT = 6

// Ширина от темы не зависит — держим её вне тела компонента, чтобы
// не создавать новый объект стиля на каждый рендер строки сетки.
const tileStyles = StyleSheet.create({
    tile: {
        width: COFFEE_ITEM_WIDTH,
    },
})

export const CoffeeItem = memo(
    ({ id, name, price, img, onPress, discount, bonus }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()

        const discountRub = useMemo(() => {
            if (!discount) {
                return null
            }
            // Цена со скидкой почти всегда дробная, а divideNumber делит на
            // разряды посимвольно и на дробях ломается — форматируем только целые.
            const value = Math.round(price * (1 - discount / 100) * 100) / 100
            return Number.isInteger(value) ? divideNumber(value) : String(value)
        }, [price, discount])

        const handlePress = useCallback(() => {
            onPress({ id, img, name, price, discount })
        }, [id, img, name, price, onPress, discount])

        const styles = StyleSheet.create({
            imageBox: {
                alignItems: 'center',
                justifyContent: 'center',
                height: IMAGE_BOX_HEIGHT * SIZES.PX,
                borderRadius: RADII.INPUT * SIZES.PX,
                // В макете подложки под фото нет — фото лежит прямо на стекле.
                // Своя тонировка нужна, чтобы снимки на прозрачном фоне
                // не сливались с амбиентным фоном экрана.
                backgroundColor: COLORS.GLASS.Primary,
                overflow: 'hidden',
            },
            img: {
                width: IMAGE_SIZE * SIZES.PX,
                height: IMAGE_SIZE * SIZES.PX,
                objectFit: 'contain',
            },
            pricesRow: {
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
            },
            priceGroup: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            oldPrice: {
                textDecorationLine: 'line-through',
            },
            freeChip: {
                alignSelf: 'flex-start',
                marginTop: PRICE_MT * SIZES.PX,
            },
        })

        return (
            <GlassCard
                variant="glass2"
                radius={RADII.TILE}
                padding={SPACING.MD}
                pressScale={PRESS_SCALE.TILE}
                onPress={handlePress}
                style={tileStyles.tile}
            >
                <View style={styles.imageBox}>
                    {img ? (
                        <Image style={styles.img} source={{ uri: img }} />
                    ) : (
                        <NoImageIcon width={64} height={64} />
                    )}
                </View>

                <Typography
                    type="rowTitle"
                    numberOfLines={2}
                    marginsPaddings={{ mt: SPACING.ROW_GAP }}
                >
                    {name}
                </Typography>

                {bonus ? (
                    <Chip
                        label="Бесплатно"
                        variant="lime"
                        size="sm"
                        style={styles.freeChip}
                    />
                ) : (
                    <View style={styles.pricesRow}>
                        <View style={styles.priceGroup}>
                            <Typography
                                type={discountRub ? 'caption12' : 'num16'}
                                color={discountRub ? 'secondary' : undefined}
                                style={
                                    discountRub ? styles.oldPrice : undefined
                                }
                                marginsPaddings={{ mt: PRICE_MT }}
                            >
                                {divideNumber(price)}
                            </Typography>
                            <BonusIcon
                                mt={PRICE_MT}
                                size={(discountRub ? 12 : 15) * SIZES.PX}
                                color={
                                    discountRub
                                        ? COLORS.TEXT.Secondary
                                        : COLORS.TEXT.Primary
                                }
                            />
                        </View>

                        {discountRub !== null && (
                            <View style={styles.priceGroup}>
                                <Typography
                                    type="num16"
                                    customColor={COLORS.STATE.Destructive}
                                    marginsPaddings={{
                                        ml: SPACING.SM,
                                        mt: PRICE_MT,
                                    }}
                                >
                                    {discountRub}
                                </Typography>
                                <BonusIcon
                                    mt={PRICE_MT}
                                    size={15 * SIZES.PX}
                                    color={COLORS.STATE.Destructive}
                                />
                            </View>
                        )}
                    </View>
                )}
            </GlassCard>
        )
    }
)
