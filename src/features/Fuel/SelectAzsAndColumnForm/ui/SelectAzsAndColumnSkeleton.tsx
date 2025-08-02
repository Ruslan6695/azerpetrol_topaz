import { memo } from 'react'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'
import { View } from 'react-native'

type Props = {}

export const SelectAzsAndColumnSkeleton = memo((props: Props) => {
    return (
        <>
            <Skeleton
                height={60 * SIZES.PX}
                width={SIZES.WIDTH(1) - SIZES.PX * 40}
            />

            <Skeleton
                margins={{ mt: 20 }}
                height={60 * SIZES.PX}
                width={SIZES.WIDTH(1) - SIZES.PX * 40}
            />
            <Skeleton
                margins={{ mt: 30 }}
                height={60 * SIZES.PX}
                width={SIZES.WIDTH(1) - SIZES.PX * 40}
            />
        </>
    )
})
