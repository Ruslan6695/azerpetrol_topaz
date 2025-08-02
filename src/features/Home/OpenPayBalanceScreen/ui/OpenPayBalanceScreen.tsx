import { Link, useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

type Props = {}

export const OpenPayBalanceScreen = (props: Props) => {
    const router = useRouter()
    return (
        <CustomTouchableOpacity
            onPress={() => {
                router.navigate(ESCREENS.PAY_BALANCE)
            }}
            style={styles.container}
        >
            <CustomText fw="600">{'Пополнить\nбаланс'}</CustomText>
        </CustomTouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.GRAY_3,
        padding: SIZES.PX * 20,
        borderRadius: SIZES.PX * 15,
        flex: 1,
        justifyContent: 'center',
    },
})
