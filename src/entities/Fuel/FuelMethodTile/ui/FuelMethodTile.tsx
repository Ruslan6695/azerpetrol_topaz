import { memo } from 'react'
import { PRESS_SCALE, RADII, SPACING } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon, TIconName } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'

type Props = {
    icon: TIconName
    title: string
    subtitle: string
    /** Только стеклянные поверхности: в макете плитки различаются глубиной фона */
    variant?: 'glass' | 'glass2'
    onPress: () => void
}

// Плитка выбора метода на экране заправки: иконка, заголовок, подпись.
// Ряд из двух таких плиток стоит под герой-карточкой.
export const FuelMethodTile = memo(
    ({ icon, title, subtitle, variant = 'glass2', onPress }: Props) => {
        return (
            <GlassCard
                variant={variant}
                radius={RADII.TILE}
                padding={SPACING.XL}
                pressScale={PRESS_SCALE.TILE}
                onPress={onPress}
            >
                <Icon name={icon} size={28} />
                <Typography
                    type="label14"
                    marginsPaddings={{ mt: SPACING.ROW_GAP }}
                >
                    {title}
                </Typography>
                <Typography
                    type="caption11"
                    color="secondary"
                    marginsPaddings={{ mt: 2 }}
                >
                    {subtitle}
                </Typography>
            </GlassCard>
        )
    }
)
