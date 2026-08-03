import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ESCREENS, RADII, SIZES, SPACING, ThemeStore } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'

type Props = {
    big_text?: string
    small_text?: string
}

// Герой главной: градиентная карточка с лаймовым кругом-стрелкой справа.
export const OpenFuelScreen = memo(({ big_text, small_text }: Props) => {
    const router = useRouter()
    const COLORS = ThemeStore.useCOLORS()
    // Топливо — вкладка таб-бара, поэтому navigate, а не push.
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.FUEL)
    }, [router])

    const styles = StyleSheet.create({
        card: {
            minHeight: 104 * SIZES.PX,
            justifyContent: 'center',
        },
        arrow: {
            position: 'absolute',
            right: 18 * SIZES.PX,
            top: '50%',
            transform: [{ translateY: -22 * SIZES.PX }],
            width: 44 * SIZES.PX,
            height: 44 * SIZES.PX,
            borderRadius: RADII.PILL,
            backgroundColor: COLORS.ACCENT.Lime,
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            paddingRight: 62 * SIZES.PX,
        },
    })

    return (
        <GlassCard
            variant="hero"
            radius={RADII.HERO_SM}
            paddingVertical={22}
            paddingHorizontal={SPACING.SCREEN}
            onPress={handlePress}
            style={styles.card}
        >
            <View style={styles.text}>
                <Typography type="h5">Заправить авто</Typography>
                <Typography
                    type="body13"
                    color="secondary"
                    marginsPaddings={{ mt: SPACING.XS }}
                >
                    {[small_text, big_text].filter(Boolean).join(' ')}
                </Typography>
            </View>
            <View style={styles.arrow}>
                <Typography type="num18" customColor={COLORS.ACCENT.OnLime}>
                    →
                </Typography>
            </View>
        </GlassCard>
    )
})
