import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    divideNumber,
    ESCREENS,
    PRESS_SCALE,
    RADII,
    SIZES,
    ThemeStore,
    UserStore,
} from '../../../shared'
import { BonusIcon } from '../../../shared/BonusIcon'
import { Glass } from '../../../shared/GlassCard'
import { Icon } from '../../../shared/Icons'
import { PressableScale } from '../../../shared/PressableScale'
import { Typography } from '../../../shared/Typography'

type Props = {}

export const HeaderWallet = memo((props: Props) => {
    const router = useRouter()
    const balance = UserStore.useBalance()
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
                        color={COLORS.Icon.Primary}
                        opacity={0.8}
                    />
                    <Typography type="label14">
                        {balance ? divideNumber(balance) : 0}
                    </Typography>
                    <BonusIcon bold size={16} />
                </View>
            </Glass>
        </PressableScale>
    )
})
