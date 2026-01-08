import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    divideNumber,
    ESCREENS,
    SIZES,
    ThemeStore,
    UserStore,
} from '../../../shared'
import { BonusIcon } from '../../../shared/BonusIcon'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { MPLayout } from '../../../shared/MpLayout'
import { Typography } from '../../../shared/Typography'
import { WalletIcon } from '../../../shared/WalletIcon'
type Props = {}

export const HeaderWallet = memo((props: Props) => {
    const router = useRouter()
    const balance = UserStore.useBalance()
    const COLORS = ThemeStore.useCOLORS()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.BALANCE)
    }, [])
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.BACKGROUND.Tertiary,
            paddingHorizontal: SIZES.PX * 15,
            paddingVertical: SIZES.PX * 5,
            borderRadius: 9999,
            borderColor: COLORS.BRAND.Secondary,
            borderWidth: 0.9 * SIZES.PX,
        },
        row: {
            alignItems: 'center',
            flexDirection: 'row',
        },
    })

    return (
        <CustomTouchableOpacity
            onPress={handlePress}
            activeOpacity={0.6}
            style={styles.container}
        >
            <WalletIcon />
            <View style={styles.row}>
                <Typography marginsPaddings={{ ml: 5 }} type="bodyAccentSmall">
                    {balance ? divideNumber(balance) : 0}
                </Typography>
                <MPLayout mt={2}>
                    <BonusIcon bold size={20} />
                </MPLayout>
            </View>
        </CustomTouchableOpacity>
    )
})
