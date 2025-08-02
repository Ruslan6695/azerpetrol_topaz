import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { IHistoryDetailsBuyOnCashItem } from '../config/interfaces/IHistoryDetailsBuyOnCashItem'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, SIZES, divideNumber, roundNumber } from '../../../../shared'

type Props = {}

export const HistoryDetailsBuyOnCashItem = memo(
    ({ name, sum, unit, price_one }: IHistoryDetailsBuyOnCashItem) => {
        return (
            <View style={styles.container}>
                <View style={styles.name}>
                    <CustomText fz={14}>{name}</CustomText>
                </View>
                <CustomText fz={12} marginsPaddings={{ mr: 20 }}>
                    {unit.count} {unit.name} x{' '}
                    {divideNumber(+price_one.toFixed(2))} ₽
                </CustomText>
                <View style={styles.totalBlock}>
                    <CustomText fz={12}>
                        {divideNumber(+sum.toFixed(2))} ₽
                    </CustomText>
                </View>
            </View>
        )
    }
)
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_3,
        paddingVertical: SIZES.PX * 10,
        paddingHorizontal:SIZES.PX * 5,
        borderRadius: SIZES.PX * 10,
    },
    name: {
        flex: 3,
        marginRight: 10,
    },
    unit: {
        flex: 1,
    },
    totalBlock: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
})
