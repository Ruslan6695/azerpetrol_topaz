import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { EHistoryItemType } from '../../../../entities/History'
import { SIZES, ThemeStore } from '../../../../shared'
import {
    CustomPieChart,
    ICustomPieChartData,
} from '../../../../shared/CustomPieChart'
import { IGetHistoryPieChartData } from '../config/interfaces/IGetHistoryPieChartData'
import { GetHistoryPieChartWithoutData } from './GetHistoryPieChartWithoutData'
type Props = {
    data: IGetHistoryPieChartData | undefined
}

export const GetHistoryPieChart = ({ data }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const chartData = useMemo<ICustomPieChartData[]>(() => {
        let arr: ICustomPieChartData[] = []

        data?.chart.forEach((el) => {
            switch (el.type) {
                case EHistoryItemType.FUEL_FILLING:
                    arr.push({
                        color: '#fc7f03',
                        text: 'Налив топлива',
                        value: el.total < 0 ? el.total * -1 : el.total,
                    })
                    break
                case EHistoryItemType.BUY_COFFEE:
                    arr.push({
                        color: COLORS.ERROR.Secondary,
                        text: 'Покупка кофе',
                        value: el.total < 0 ? el.total * -1 : el.total,
                    })
                    break
                case EHistoryItemType.BUY_ON_CASH:
                    arr.push({
                        color: COLORS.BRAND.Primary,
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
    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                width: '100%',
                paddingHorizontal: SIZES.PX * 30,
                paddingVertical: SIZES.PX * 30,
                borderRadius: SIZES.PX * 16,
                alignItems: 'center',
            },
        })
    }, [])
    return (
        <View style={styles.container}>
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
