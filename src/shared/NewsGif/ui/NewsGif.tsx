import LottieView from 'lottie-react-native'
import React from 'react'
import { SIZES } from '../../common/config/constants/sizes'

type Props = {
    width?: number
    height?: number
}

export const NewsGif = ({ width, height }: Props) => {
    return (
        <LottieView
            autoPlay
            style={{
                width: (width || 200) * SIZES.PX,
                height: (height || 200) * SIZES.PX,
            }}
            loop
            source={require('../assets/news.json')}
        />
    )
}
