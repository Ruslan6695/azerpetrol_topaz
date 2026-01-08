import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { Typography } from '../../../../shared/Typography'

type Props = {}

export const GetHistoryPieChartWithoutData = (props: Props) => {
    return (
        <View style={styles.container}>
            <MPLayout mb={-20} mt={-20}>
                <Image source={require('../assets/blured.png')} />
            </MPLayout>
            <View style={styles.textBlock}>
                <Typography type="caption" textAlign="center">
                    НЕТ ДАННЫХ ЗА ВЫБРАННЫЙ ПЕРИОД
                </Typography>
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
