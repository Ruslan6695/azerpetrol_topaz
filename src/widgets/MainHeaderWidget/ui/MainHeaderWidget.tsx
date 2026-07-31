import React from 'react'
import { StyleSheet, View } from 'react-native'
import { HeaderWallet } from '../../../entities/HeaderWallet'
import { SIZES } from '../../../shared'
import { Wordmark } from '../../../shared/Logo'

type Props = {}

// Хак с Device.osName для высоты убран: верхний отступ теперь даёт
// SafeAreaView с edges={['top', ...]} в (main)/_layout.
export const MainHeaderWidget = (props: Props) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14 * SIZES.PX,
            paddingHorizontal: 20 * SIZES.PX,
        },
    })
    return (
        <View style={styles.container}>
            <Wordmark height={15} />
            <HeaderWallet />
        </View>
    )
}
