import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, UserStore } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { WalletIcon } from '../../../shared/WalletIcon'
type Props = {}

export const HeaderWallet = memo((props: Props) => {
    const balance = UserStore.useBalance()
    const name = UserStore.useUser()?.name
    return (
        <View style={styles.container}>
            <View style={styles.textBlock}>
                <CustomText fw="600" fz={20}>
                    {balance} ₽
                </CustomText>
                <CustomText fz={12}>{name}</CustomText>
            </View>
            <WalletIcon />
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textBlock: {
        alignItems: 'flex-end',
        marginRight: 10 * SIZES.PX,
    },
})
