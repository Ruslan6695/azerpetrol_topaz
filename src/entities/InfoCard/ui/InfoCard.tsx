import { memo } from 'react'
import { RADII, SPACING } from '../../../shared'
import { GlassCard } from '../../../shared/GlassCard'
import { Typography } from '../../../shared/Typography'
import { IInfoCard } from '../config/interfaces/IInfoCard'

type Props = IInfoCard

// Информационная карточка нового дизайна. Старый InfoBlock оставлен
// для ещё не переделанных экранов и постепенно заменяется этой.
export const InfoCard = memo(({ title, info }: Props) => {
    return (
        <GlassCard radius={RADII.CARD} padding={SPACING.XL}>
            <Typography type="label14">{title}</Typography>
            <Typography
                type="body13"
                color="secondary"
                marginsPaddings={{ mt: 4 }}
            >
                {info}
            </Typography>
        </GlassCard>
    )
})
