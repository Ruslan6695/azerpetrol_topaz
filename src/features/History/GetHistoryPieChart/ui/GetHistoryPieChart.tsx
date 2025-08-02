import { memo, useMemo } from 'react'
import {
    CustomPieChart,
    ICustomPieChartData,
} from '../../../../shared/CustomPieChart'
import { IGetHistoryPieChartData } from '../config/interfaces/IGetHistoryPieChartData'
import { Image, StyleSheet, View } from 'react-native'
import { COLORS, SIZES, roundNumber } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { EHistoryItemType } from '../../../../entities/History'
import BluredSvg from '../assets/blured.svg'
import { GetHistoryPieChartWithoutData } from './GetHistoryPieChartWithoutData'
type Props = {
    data: IGetHistoryPieChartData | undefined
}

export const GetHistoryPieChart = ({ data }: Props) => {
    const chartData = useMemo<ICustomPieChartData[]>(() => {
        let arr: ICustomPieChartData[] = []
        data?.chart.forEach((el) => {
            switch (el.type) {
                case EHistoryItemType.FUEL_FILLING:
                    arr.push({
                        color: '#AF91FA',
                        text: 'Налив топлива',
                        value: el.total < 0 ? el.total * -1 : el.total,
                    })
                    break
                case EHistoryItemType.BUY_COFFEE:
                    arr.push({
                        color: '#C8A071',
                        text: 'Покупка коффе',
                        value: el.total < 0 ? el.total * -1 : el.total,
                    })
                    break
                case EHistoryItemType.BUY_ON_CASH:
                    arr.push({
                        color: '#32CE55',
                        text: 'Покупка продуктов',
                        value: el.total < 0 ? el.total * -1 : el.total,
                    })
                    break
                case EHistoryItemType.TRANSFER_BALANCE:
                    arr.push({
                        color: '#3269ce',
                        text: 'Переводы',
                        value: el.total < 0 ? el.total * -1 : el.total,
                    })
                    break

                default:
                    break
            }
        })

        return arr
    }, [data])
    return (
        <View style={styles.container}>
            <CustomText marginsPaddings={{ mt: -20, mb: 30 }}>
                Траты за текущий месяц
            </CustomText>
            {chartData.length === 0 ? (
                <GetHistoryPieChartWithoutData />
            ) : (
                <CustomPieChart
                    centerTotal={
                        data?.total_all ? +data.total_all.toFixed(2) : 0
                    }
                    data={chartData}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.GRAY_3,
        width: SIZES.WIDTH(0.92),
        paddingHorizontal: SIZES.PX * 30,
        paddingVertical: SIZES.PX * 30,
        borderRadius: SIZES.PX * 20,
        alignItems: 'center',
    },
})
