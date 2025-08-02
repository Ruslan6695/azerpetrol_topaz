import React from 'react'
import { SIZES } from '../../../../shared'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'

type Props = {}

export const NewsItemSkeleton = (props: Props) => {
    return (
        <Skeleton
            height={SIZES.PX * 90}
            width={SIZES.WIDTH(1) - SIZES.PX * 40}
        />
    )
}
