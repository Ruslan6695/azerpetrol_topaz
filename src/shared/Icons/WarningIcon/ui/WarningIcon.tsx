import React from 'react'
import WarningSvg from '../assets/info.svg'
import { DEFAULT_ICON_SIZE } from '../../../common/config/constants/DEFAULT_ICON_SIZE'
import { SIZES } from '../../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const WarningIcon = ({ size }: Props) => {
    return <WarningSvg width={(size || DEFAULT_ICON_SIZE) * SIZES.PX} />
}
