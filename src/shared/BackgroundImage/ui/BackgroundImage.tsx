import { memo } from 'react'
import BackgroundImg from '../assets/background.svg'
import { StyleSheet } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    top?: number
    bottom?: number
    right?: number
    left?: number
}

export const BackgroundImage = memo(({ bottom, left, right, top }: Props) => {
    const styles = StyleSheet.create({
        absolute: {
            position: 'absolute',
            top: top ? top * SIZES.PX : undefined,
            right: right ? right * SIZES.PX : undefined,
            left: left ? left * SIZES.PX : undefined,
            bottom: bottom ? bottom * SIZES.PX : undefined,
            resizeMode: 'repeat',
        },
    })

    return <BackgroundImg style={styles.absolute} />
})
