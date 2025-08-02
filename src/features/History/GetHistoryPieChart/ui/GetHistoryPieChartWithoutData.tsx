import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, SIZES } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'

type Props = {}

export const GetHistoryPieChartWithoutData = (props: Props) => {
    return (
        <View style={styles.container}>
            <MPLayout mb={-20} mt={-20}>
                <Image source={require('../assets/blured.png')} />
            </MPLayout>
            <View style={styles.textBlock}>
                <CustomText fw="600" textAlign="center">
                    НЕТ ДАННЫХ ЗА ВЫБРАННЫЙ ПЕРИОД
                </CustomText>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    textBlock: {
        position: 'absolute',
        top: '30%',
        left: '17%',
        borderRadius: SIZES.PX * 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingVertical: SIZES.PX * 10,
        paddingHorizontal: 20 * SIZES.PX,
    },
})
