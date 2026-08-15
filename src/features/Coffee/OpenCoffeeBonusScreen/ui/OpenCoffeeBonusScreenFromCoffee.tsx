import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ESCREENS, RADII, SIZES, SPACING, ThemeStore } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'

type Props = {
    count: number
}

// Геометрия та же, что у CoffeeMethodCard: карточки стоят в одном столбце.
const CARD_PADDING = 18
const SUBTITLE_MT = 2

// Лаймовая карточка входа в бонусное меню (dc.html:232–236).
export const OpenCoffeeBonusScreenFromCoffee = memo(({ count }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const router = useRouter()

    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.COFFEE_BONUS)
    }, [router])

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.LG * SIZES.PX,
        },
        titles: {
            flex: 1,
        },
    })

    return (
        <GlassCard
            variant="lime"
            radius={RADII.CARD}
            padding={CARD_PADDING}
            onPress={handlePress}
        >
            <View style={styles.row}>
                <Icon name="gift" size={36} />
                <View style={styles.titles}>
                    <Typography type="rowTitle">
                        {`Бесплатный кофе: ${count}`}
                    </Typography>
                    <Typography
                        type="caption12"
                        color="secondary"
                        marginsPaddings={{ mt: SUBTITLE_MT }}
                    >
                        Выберите любимый напиток
                    </Typography>
                </View>
                <Typography type="num15" customColor={COLORS.ACCENT.Primary}>
                    →
                </Typography>
            </View>
        </GlassCard>
    )
})
