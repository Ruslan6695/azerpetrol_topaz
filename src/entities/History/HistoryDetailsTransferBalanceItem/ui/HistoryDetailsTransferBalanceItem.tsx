import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { MPLayout } from '../../../../shared/MpLayout'

type Props = {
    icon: ReactNode
    title: string
    info: string
}

export const HistoryDetailsTransferBalanceItem = ({
    icon,
    info,
    title,
}: Props) => {
    return (
        <View style={styles.row}>
            {icon}
            <MPLayout ml={20}>
                <CustomText secondary fz={14}>
                    {title}
                </CustomText>
                <CustomText fw="600" fz={18}>
                    {info}
                </CustomText>
            </MPLayout>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.PX * 10,
        borderRadius: SIZES.PX * 10,
        backgroundColor: COLORS.GRAY_3,
    },
})
