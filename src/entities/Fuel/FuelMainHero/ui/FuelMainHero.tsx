import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING, ThemeStore } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'

type Props = {
    onPress: () => void
}

// Герой экрана заправки: градиентная карточка с иконкой сверху
// и лаймовым кругом-стрелкой справа по центру.
export const FuelMainHero = memo(({ onPress }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        // Круг-стрелка лежит поверх текста, поэтому текстовому блоку
        // отдаём ширину без него: 18 отступа + 40 круга.
        text: {
            paddingRight: 58 * SIZES.PX,
        },
        arrow: {
            position: 'absolute',
            right: 18 * SIZES.PX,
            top: '50%',
            transform: [{ translateY: -20 * SIZES.PX }],
            width: 40 * SIZES.PX,
            height: 40 * SIZES.PX,
            borderRadius: RADII.PILL,
            backgroundColor: COLORS.ACCENT.Lime,
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

    return (
        <GlassCard
            variant="hero"
            radius={RADII.HERO_SM}
            paddingVertical={22}
            paddingHorizontal={SPACING.SCREEN}
            onPress={onPress}
        >
            <View style={styles.text}>
                <Icon name="fuel_select" size={38} />
                <Typography type="num18" marginsPaddings={{ mt: SPACING.LG }}>
                    Выбрать колонку
                </Typography>
                <Typography
                    type="body125"
                    color="secondary"
                    marginsPaddings={{ mt: 2 }}
                >
                    Вручную из списка АЗС
                </Typography>
            </View>
            <View style={styles.arrow}>
                <Typography type="num17" customColor={COLORS.ACCENT.OnLime}>
                    →
                </Typography>
            </View>
        </GlassCard>
    )
})
