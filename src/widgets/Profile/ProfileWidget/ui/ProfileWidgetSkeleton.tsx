import React from 'react'
import { View } from 'react-native'
import { ProfileImg } from '../../../../entities/Profile/ProfileImg'
import { CustomText } from '../../../../shared/CustomText'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../../shared'

type Props = {}

export const ProfileWidgetSkeleton = (props: Props) => {
    return (
        <>
            <Skeleton
                margins={{ mt: 10, mb: 10 }}
                width={200 * SIZES.PX}
                height={30 * SIZES.PX}
            />
            <Skeleton
                margins={{ mb: 20 }}
                width={150 * SIZES.PX}
                height={20 * SIZES.PX}
            />
        </>
    )
}
