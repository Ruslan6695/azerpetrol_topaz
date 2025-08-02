import { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { BalanceBlock } from '../../../entities/BalanceBlock'
import { QrBlock } from '../../../entities/QrBlock'
import { MapInfoBlocks } from '../../../features/MapInfoBlocks'
import { SIZES, UserStore, getToken, useGetBalance } from '../../../shared'
import { BALANCE_WIDGET_INFO_TEXTS } from '../config/constants/BALANCE_WIDGET_INFO_TEXTS'
import { CustomButton } from '../../../shared/CustomButton'
import { useFocusEffect } from 'expo-router'

type Props = {}

export const BalanceWidget = memo((props: Props) => {
    const { balance, fetchBalance, isBalanceLoading } = useGetBalance()
    const token = UserStore.useUser()?.token

    useFocusEffect(
        useCallback(() => {
            fetchBalance({
                args: undefined,
            })
        }, [])
    )
    return (
        <View>
            <View style={styles.center}>
                <QrBlock qr={token} title="ВАШ УНИКАЛЬНЫЙ КОД" />
            </View>
            <BalanceBlock balance={balance} />
            <MapInfoBlocks infoBlocks={BALANCE_WIDGET_INFO_TEXTS} />
        </View>
    )
})

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        marginBottom: 30 * SIZES.PX,
    },
    container: {
        alignItems: 'center',
    },
})
