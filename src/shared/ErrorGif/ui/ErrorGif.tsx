import LottieView from 'lottie-react-native'
import { memo } from 'react'
import { SIZES } from '../../common/config/constants/sizes'

interface IStyled {
    width?: number
    height?: number
}
export const ErrorGif = memo(({ width, height }: IStyled) => {
    return (
        <LottieView
            autoPlay
            style={{
                width: (width || 200) * SIZES.PX,
                height: (height || 200) * SIZES.PX,
            }}
            loop
            source={require('../assets/error.json')}
        />
    )
})
