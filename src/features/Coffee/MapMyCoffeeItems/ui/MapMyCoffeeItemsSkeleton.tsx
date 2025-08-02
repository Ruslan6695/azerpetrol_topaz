import React from 'react'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'

type Props = {}

export const MapMyCoffeeItemsSkeleton = (props: Props) => {
    return (
        <>
            {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton
                    key={item}
                    height={70 * SIZES.PX}
                    width={SIZES.WIDTH(1) - SIZES.PX * 40}
                />
            ))}
        </>
    )
}
