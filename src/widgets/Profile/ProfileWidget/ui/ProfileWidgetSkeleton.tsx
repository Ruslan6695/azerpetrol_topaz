import { memo } from 'react'
import { SIZES } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

// Полосы под h5 (24) и body14 (14) — размеры имени и телефона в ProfileWidget.
export const ProfileWidgetSkeleton = memo(() => {
    return (
        <>
            <Skeleton
                margins={{ mt: 4 }}
                width={140 * SIZES.PX}
                height={24 * SIZES.PX}
            />
            <Skeleton width={110 * SIZES.PX} height={16 * SIZES.PX} />
        </>
    )
})
