import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Logo } from '../../../shared/Logo'
import { EDeviceOsNames, SIZES } from '../../../shared'
import { HeaderWallet } from '../../../entities/HeaderWallet'
import * as Device from 'expo-device'
type Props = {}

export const MainHeaderWidget = (props: Props) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: Device.osName === EDeviceOsNames.IOS ? 120 : 100 * SIZES.PX,
            paddingTop:
                Device.osName === EDeviceOsNames.IOS ? 30 : 0 * SIZES.PX,
            paddingHorizontal: SIZES.PX * 20,
        },
    })
    return (
        <View style={styles.container}>
            <Logo size={50} />
            <HeaderWallet />
        </View>
    )
}
