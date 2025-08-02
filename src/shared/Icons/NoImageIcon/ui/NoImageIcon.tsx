import { memo } from 'react'
import NoImageSvg from '../assets/noimage.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    width?: number
    height?: number
}

export const NoImageIcon = memo(({ width, height }: Props) => {
    return (
        <NoImageSvg
            height={(height || 200) * SIZES.PX}
            width={(width || 200) * SIZES.PX}
        />
    )
})
