import { useFocusEffect, useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { QrBlock } from '../../../entities/QrBlock'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import { MapInfoBlocks } from '../../../features/MapInfoBlocks'
import {
    AppStore,
    ESCREENS,
    SIZES,
    UserStore,
    useGetBalance,
} from '../../../shared'
import { CustomButton } from '../../../shared/CustomButton'
import { BALANCE_WIDGET_INFO_TEXTS } from '../config/constants/BALANCE_WIDGET_INFO_TEXTS'

type Props = {
    isHidePayButton: boolean
}

export const BalanceWidget = memo(({ isHidePayButton }: Props) => {
    const { balance, fetchBalance, isBalanceLoading } = useGetBalance()
    const isTokenRefreshed = AppStore.useIsTokenRefreshed()
    const token = UserStore.useUser()?.token
    const router = useRouter()

    const onPayBalance = useCallback(() => {
        router.navigate(ESCREENS.PAY_BALANCE)
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchBalance({
                args: undefined,
            })
        }, [])
    )
    return (
        <View>
            <ScreenTitle title="Ваш уникальный код" />
            <View style={styles.center}>
                <QrBlock qr={isTokenRefreshed ? token : undefined} />
            </View>
            {!isHidePayButton && (
                <CustomButton
                    onPress={onPayBalance}
                    styled={{ marginsPaddings: { mt: 20 }, type: 'primary' }}
                >
                    Пополнить счет
                </CustomButton>
            )}
            <MapInfoBlocks infoBlocks={BALANCE_WIDGET_INFO_TEXTS} />
        </View>
    )
})

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        marginTop: 20 * SIZES.PX,
    },
    container: {
        alignItems: 'center',
    },
})
