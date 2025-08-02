import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { CustomPieChartLegendItem } from './CustomPieChartLegendItem'
import { SIZES } from '../../common/config/constants/sizes'
import { ICustomPieChartData } from '../config/interfaces/ICustomPieChartData'
import { COLORS } from '../../common/config/constants/COLORS'
import { CustomText } from '../../CustomText'
import { divideNumber } from '../../common/config/lib/helpers/divideNumber'
import { randomUUID } from 'expo-crypto'

type Props = {
    data: ICustomPieChartData[]
    centerTotal?: number
}

export const CustomPieChart = memo(({ data, centerTotal }: Props) => {
    return (
        <View style={styles.container}>
            <PieChart
                innerRadius={50 * SIZES.PX}
                strokeWidth={0.5 * SIZES.PX}
                strokeColor="gray"
                radius={80 * SIZES.PX}
                donut
                centerLabelComponent={
                    centerTotal
                        ? () => (
                              <CustomText fz={13}>
                                  {divideNumber(centerTotal)} ₽
                              </CustomText>
                          )
                        : undefined
                }
                data={data}
            />
            <View style={styles.legendContainer}>
                {data.map((item) => (
                    <CustomPieChartLegendItem key={randomUUID()} {...item} />
                ))}
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 140 * SIZES.PX,
        marginTop: SIZES.PX * -15,
    },
    legendContainer: {
        gap: SIZES.PX * 10,
        height: '100%',
        marginLeft: SIZES.PX * 20,
        justifyContent: 'space-evenly',
    },
})
