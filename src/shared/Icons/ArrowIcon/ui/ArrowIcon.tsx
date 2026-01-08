import React from 'react'
import ArrowSvg from '../assets/arrow.svg'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    width?: number
    height?: number
}

export const ArrowIcon = ({ width, height }: Props) => {
    return (
        <ArrowSvg
            width={(width || 10) * SIZES.PX}
            height={(height || 15) * SIZES.PX}
        />
    )
}
