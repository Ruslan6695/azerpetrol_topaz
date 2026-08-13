import { memo } from 'react'
import { RADII, SIZES } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

// Высота под карточку: паддинги 16×2 + заголовок 15 + плитка 100 + ссылка.
export const ProfileJoinAccountsWidgetSkeleton = memo(() => {
    return (
        <Skeleton
            height={196 * SIZES.PX}
            width={SIZES.WIDTH(1) - SIZES.PX * 40}
            style={{ borderRadius: RADII.CARD * SIZES.PX }}
        />
    )
})
