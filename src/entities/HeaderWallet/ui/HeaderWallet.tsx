import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    ESCREENS,
    HIDDEN_BALANCE,
    PRESS_SCALE,
    RADII,
    SIZES,
    ThemeStore,
    UserStore,
} from '../../../shared'
import { AnimatedNumber } from '../../../shared/AnimatedNumber'
import { Glass } from '../../../shared/GlassCard'
import { Icon } from '../../../shared/Icons'
import { PressableScale } from '../../../shared/PressableScale'
import { Typography } from '../../../shared/Typography'

type Props = {}

export const HeaderWallet = memo((props: Props) => {
    const router = useRouter()
    const balance = UserStore.useBalance()
    const isBalanceHidden = UserStore.useIsBalanceHidden()
    const COLORS = ThemeStore.useCOLORS()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.BALANCE)
    }, [router])

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6 * SIZES.PX,
            paddingHorizontal: 14 * SIZES.PX,
            paddingVertical: 7 * SIZES.PX,
        },
    })

    return (
        <PressableScale onPress={handlePress} scaleTo={PRESS_SCALE.CHIP}>
            <Glass level="secondary" radius={RADII.PILL}>
                <View style={styles.row}>
                    <Icon
                        name="wallet"
                        size={18}
                        color={COLORS.TEXT.Primary}
                        opacity={0.8}
                    />
                    {/* По макету в чипе рублёвый баланс, иконки бонуса нет —
                        бонусы показывает карточка на главной. Число то же
                        самое, что в карточке, поэтому набегает синхронно с ней */}
                    {isBalanceHidden ? (
                        <Typography type="label14">
                            {HIDDEN_BALANCE.AMOUNT}
                        </Typography>
                    ) : (
                        <AnimatedNumber
                            value={balance ?? 0}
                            suffix="₽"
                            type="label14"
                        />
                    )}
                </View>
            </Glass>
        </PressableScale>
    )
})
