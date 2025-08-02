import LottieView from 'lottie-react-native'
import { memo } from 'react'
import { SIZES } from '../../../shared'

type Props = {
    width?: number
    height?: number
}

export const PayBalanceWaitingGif = memo(({ height, width }: Props) => {
    return (
        <LottieView
            autoPlay
            style={{
                width: (width || 200) * SIZES.PX,
                height: (height || 200) * SIZES.PX,
            }}
            loop
            source={require('../assets/payment.json')}
        />
    )
})
