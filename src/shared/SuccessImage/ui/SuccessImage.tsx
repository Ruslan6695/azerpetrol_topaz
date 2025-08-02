import { memo } from 'react'
import SuccessSvg from '../assets/success.svg'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    width?: number
    height?: number
}

export const SuccessImage = ({ width, height }: Props) => {
    return (
        <SuccessSvg
            height={(height || 140) * SIZES.PX}
            width={(width || 200) * SIZES.PX}
        />
    )
}
