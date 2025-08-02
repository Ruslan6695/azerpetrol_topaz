import React from 'react'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { Link, useRouter } from 'expo-router'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

type Props = {}

export const OpenTransferBalanceScreen = (props: Props) => {
    const router = useRouter()

    return (
        <CustomTouchableOpacity
            onPress={() => {
                router.navigate(ESCREENS.TRANSFER_BALANCE)
            }}
            style={styles.container}
        >
            <CustomText fw="600">{'Перевод\nсредств'}</CustomText>
        </CustomTouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.GRAY_3,
        padding: SIZES.PX * 20,
        borderRadius: SIZES.PX * 15,
        justifyContent: 'center',
    },
})
