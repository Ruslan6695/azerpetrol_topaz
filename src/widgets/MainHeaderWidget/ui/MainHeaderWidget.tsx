import React from 'react'
import { StyleSheet, View } from 'react-native'
import { HeaderWallet } from '../../../entities/HeaderWallet'
import { SIZES } from '../../../shared'
import { Typography } from '../../../shared/Typography'

type Props = {}

// Хак с Device.osName для высоты убран: верхний отступ теперь даёт
// SafeAreaView с edges={['top', ...]} в (main)/_layout.
// ⚠️ Wordmark временно заменён текстом "testTopaz" для тестовой сборки —
// вернуть <Wordmark height={15} /> из '../../../shared/Logo' после теста.
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
            <Typography type="h6">testTopaz</Typography>
            <HeaderWallet />
        </View>
    )
}
