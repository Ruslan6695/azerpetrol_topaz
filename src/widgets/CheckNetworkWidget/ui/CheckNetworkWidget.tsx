import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../shared'
import { Typography } from '../../../shared/Typography'
import WifiSvg from '../assets/wifi.svg'
type Props = {}

export const CheckNetworkWidget = (props: Props) => {
    return (
        <View style={styles.container}>
            <Typography textAlign="center">Произошла ошибка!</Typography>
            <Typography type="caption" marginsPaddings={{ mb: 70 }}>
                Проверьте подключение к интернету
            </Typography>
            <WifiSvg width={SIZES.PX * 150} height={SIZES.PX * 150} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: SIZES.HEIGHT(0.6),
    },
})
