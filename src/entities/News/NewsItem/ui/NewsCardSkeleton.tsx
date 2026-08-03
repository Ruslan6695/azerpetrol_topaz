import { memo } from 'react'
import { RADII, SIZES } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

type Props = {}

export const NewsCardSkeleton = memo((props: Props) => {
    return (
        <Skeleton
            width={200 * SIZES.PX}
            height={86 * SIZES.PX}
            style={{ borderRadius: RADII.ROW * SIZES.PX }}
        />
    )
})
