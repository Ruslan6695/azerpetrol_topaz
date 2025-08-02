import { memo } from 'react'
import Skeleton from '../../Skeleton/ui/Skeletons'

type Props = {
    size?: number
}

export const QrCodeSkeleton = memo(({ size }: Props) => {
    return <Skeleton width={size ? size : 220} height={size ? size : 220} />
})
