import React from 'react'
import { View } from 'react-native'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'

type Props = {}

export const TransferBalanceConfirmSkeleton = (props: Props) => {
    return (
        <>
            <Skeleton
                margins={{ mb: 10 }}
                width={300 * SIZES.PX}
                height={56 * SIZES.PX}
            />
            <Skeleton
                margins={{ mb: 10 }}
                width={300 * SIZES.PX}
                height={56 * SIZES.PX}
            />
            <Skeleton
                margins={{ mb: 10 }}
                width={300 * SIZES.PX}
                height={56 * SIZES.PX}
            />
            <Skeleton
                margins={{ mb: 10 }}
                width={300 * SIZES.PX}
                height={56 * SIZES.PX}
            />
        </>
    )
}
