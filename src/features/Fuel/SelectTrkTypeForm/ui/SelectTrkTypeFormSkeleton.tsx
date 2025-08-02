import { memo } from 'react'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'

type Props = {}

export const SelectTrkTypeFormSkeleton = memo((props: Props) => {
    return (
        <>
            <Skeleton
                height={45 * SIZES.PX}
                width={SIZES.WIDTH(1) - 60 * SIZES.PX}
            />
            <Skeleton
                height={45 * SIZES.PX}
                width={SIZES.WIDTH(1) - 60 * SIZES.PX}
            />
            <Skeleton
                height={45 * SIZES.PX}
                width={SIZES.WIDTH(1) - 60 * SIZES.PX}
            />
        </>
    )
})
