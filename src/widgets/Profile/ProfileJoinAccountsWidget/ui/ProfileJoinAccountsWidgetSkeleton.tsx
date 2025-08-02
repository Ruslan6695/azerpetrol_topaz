import { memo } from 'react'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'

type Props = {}

export const ProfileJoinAccountsWidgetSkeleton = memo((props: Props) => {
    return (
        <Skeleton
            height={150 * SIZES.PX}
            width={SIZES.WIDTH(1) - SIZES.PX * 40}
        />
    )
})
