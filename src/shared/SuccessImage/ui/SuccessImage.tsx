import { memo } from 'react'
import SuccessSvg from '../assets/check.svg'
import { SIZES } from '../../common/config/constants/sizes'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../../common/config/constants/COLORS'
type Props = {
    width?: number
    height?: number
}

export const SuccessImage = ({ width, height }: Props) => {
    return (
        <View style={styles.container}>
            <SuccessSvg width={24 * SIZES.PX} height={24 * SIZES.PX} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.SUCCESS.Primary,
        width: 72 * SIZES.PX,
        height: 72 * SIZES.PX,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
