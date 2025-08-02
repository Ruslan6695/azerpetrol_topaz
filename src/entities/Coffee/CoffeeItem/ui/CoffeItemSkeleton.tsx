import React from 'react'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'
import { View } from 'react-native'

type Props = {}

export const CoffeItemSkeleton = (props: Props) => {
    return (
        <View>
            <Skeleton
                height={190 * SIZES.PX}
                width={SIZES.WIDTH(1 / 2) - SIZES.PX * 30}
            />
            <Skeleton
                margins={{ mt: 10, mb: 10 }}
                height={20}
                width={SIZES.WIDTH(1 / 2) / 1.5}
            />
            <Skeleton
                margins={{ mt: 10, mb: 10 }}
                height={20}
                width={50 * SIZES.PX}
            />
        </View>
    )
}
