import { memo } from 'react'
import { RADII, SPACING } from '../../../shared'
import { GlassCard } from '../../../shared/GlassCard'
import { Typography } from '../../../shared/Typography'
import { IInfoCard } from '../config/interfaces/IInfoCard'

type Props = IInfoCard

// Блок-подсказка макета: заголовок 700/14 + подпись 600/12 в стеклянной
// карточке. Повторяется на Топливе, Балансе, Выборе, Меню кофе, Пополнении.
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
