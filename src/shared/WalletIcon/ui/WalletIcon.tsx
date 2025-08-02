import React from 'react'
import WalletSvg from '../assets/wallet.svg'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    size?: number
}

export const WalletIcon = ({ size }: Props) => {
    return (
        <WalletSvg
            width={(size || 25) * SIZES.PX}
            height={(size || 25) * SIZES.PX}
        />
    )
}
