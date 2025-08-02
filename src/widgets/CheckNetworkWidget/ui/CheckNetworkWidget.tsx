import React from 'react'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import WifiSvg from '../assets/wifi.svg'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../shared/CustomText'
import { SIZES } from '../../../shared'
type Props = {}

export const CheckNetworkWidget = (props: Props) => {
    return (
        <View style={styles.container}>
            <CustomText textAlign="center" fz={25} fw="600">
                Произошла ошибка!
            </CustomText>
            <CustomText marginsPaddings={{ mb: 70 }}>
                Проверьте подключение к интернету
            </CustomText>
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
