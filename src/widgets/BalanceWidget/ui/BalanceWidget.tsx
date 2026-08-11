import { useFocusEffect, useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../entities/InfoCard'
import { QrBlock } from '../../../entities/QrBlock'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import {
    AppStore,
    ESCREENS,
    SIZES,
    SPACING,
    UserStore,
    useGetBalance,
} from '../../../shared'
import { PillButton } from '../../../shared/PillButton'
import { Typography } from '../../../shared/Typography'
import { BALANCE_WIDGET_INFO_TEXTS } from '../config/constants/BALANCE_WIDGET_INFO_TEXTS'

type Props = {
    isHidePayButton: boolean
}

export const BalanceWidget = memo(({ isHidePayButton }: Props) => {
    // Баланс на этом экране не показывается — запрос обновляет UserStore,
    // из которого живёт чип баланса в шапке.
    const { fetchBalance } = useGetBalance()
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

    const styles = StyleSheet.create({
        center: {
            alignItems: 'center',
            marginTop: SPACING.MD * SIZES.PX,
        },
        infoList: {
            gap: SPACING.MD * SIZES.PX,
            marginTop: SPACING.XL * SIZES.PX,
        },
        button: {
            marginTop: SPACING.XL * SIZES.PX,
        },
    })

    return (
        <View>
            <ScreenTitle title="Ваш уникальный код" ml={SPACING.XS} mb={2} />
            <View style={styles.center}>
                <QrBlock qr={isTokenRefreshed ? token : undefined} />
            </View>
            <Typography
                type="body125"
                color="secondary"
                textAlign="center"
                marginsPaddings={{ mt: SPACING.MD }}
            >
                Покажите код на кассе для списания и начисления бонусов
            </Typography>
            {!isHidePayButton && (
                <PillButton
                    title="Пополнить счёт"
                    onPress={onPayBalance}
                    style={styles.button}
                />
            )}
            <View style={styles.infoList}>
                {BALANCE_WIDGET_INFO_TEXTS.map((infoBlock) => (
                    <InfoCard
                        key={infoBlock.title}
                        title={infoBlock.title}
                        info={infoBlock.info}
                    />
                ))}
            </View>
        </View>
    )
})
