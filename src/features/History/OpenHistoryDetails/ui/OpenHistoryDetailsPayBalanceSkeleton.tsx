import { memo } from 'react'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'

type Props = {}

export const OpenHistoryDetailsPayBalanceSkeleton = memo((props: Props) => {
    return (
        <>
            <Skeleton
                width={70 * SIZES.PX}
                height={20 * SIZES.PX}
                margins={{ mt: 35, mb: 10 }}
            />
            <Skeleton width={80 * SIZES.PX} height={40 * SIZES.PX} />
        </>
    )
})
