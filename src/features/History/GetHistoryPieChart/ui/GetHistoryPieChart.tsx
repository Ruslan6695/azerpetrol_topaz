import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { EHistoryItemType } from '../../../../entities/History'
import { HistoryChartLegendItem } from '../../../../entities/History/HistoryChartLegendItem'
import {
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    divideNumber,
} from '../../../../shared'
import { BonusIcon } from '../../../../shared/BonusIcon'
import { DonutChart } from '../../../../shared/DonutChart'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'
import { IGetHistoryPieChartData } from '../config/interfaces/IGetHistoryPieChartData'
import { GetHistoryPieChartWithoutData } from './GetHistoryPieChartWithoutData'

type Props = {
    data: IGetHistoryPieChartData | undefined
}

const TYPE_LABELS: Record<EHistoryItemType, string> = {
    [EHistoryItemType.PAY_BALANCE]: 'Пополнение баланса',
    [EHistoryItemType.TRANSFER_BALANCE]: 'Переводы',
    [EHistoryItemType.FUEL_FILLING]: 'Налив топлива',
    [EHistoryItemType.BUY_COFFEE]: 'Покупка кофе',
    [EHistoryItemType.BUY_ON_CASH]: 'Покупка продуктов',
}

// Сводка за период из макета (dc.html:299–301): кольцо 160 с суммой в центре.
// Секторов в макете три и проценты в них выдуманы — рисуем честные сегменты
// по типам операций из history/chart/ и добавляем легенду, без которой
// пять безымянных цветов не читаются.
export const GetHistoryPieChart = memo(({ data }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const segments = useMemo(() => {
        const TYPE_COLORS: Record<EHistoryItemType, string> = {
            [EHistoryItemType.PAY_BALANCE]: COLORS.HISTORY.PayBalance,
            [EHistoryItemType.TRANSFER_BALANCE]: COLORS.HISTORY.Transfer,
            [EHistoryItemType.FUEL_FILLING]: COLORS.HISTORY.Fuel,
            [EHistoryItemType.BUY_COFFEE]: COLORS.HISTORY.Coffee,
            [EHistoryItemType.BUY_ON_CASH]: COLORS.HISTORY.Cash,
        }

        return (data?.chart ?? [])
            .map((item) => ({
                color: TYPE_COLORS[item.type],
                label: TYPE_LABELS[item.type],
                // Списания приходят отрицательными — в долях кольца важен объём
                value: Math.abs(item.total),
            }))
            .filter((item) => Boolean(item.color) && item.value > 0)
    }, [data, COLORS])

    const styles = StyleSheet.create({
        chart: {
            alignItems: 'center',
            paddingVertical: 6 * SIZES.PX,
        },
        center: {
            alignItems: 'center',
        },
        total: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        legend: {
            gap: SPACING.ROW_GAP * SIZES.PX,
            marginTop: SPACING.XL * SIZES.PX,
        },
    })

    if (segments.length === 0) {
        return (
            <GlassCard radius={RADII.CARD} padding={SPACING.SCREEN}>
                <GetHistoryPieChartWithoutData />
            </GlassCard>
        )
    }

    return (
        <GlassCard radius={RADII.CARD} padding={SPACING.SCREEN}>
            <View style={styles.chart}>
                <DonutChart segments={segments}>
                    <View style={styles.center}>
                        <View style={styles.total}>
                            <Typography type="num20">
                                {divideNumber(
                                    data?.total_all
                                        ? +data.total_all.toFixed(2)
                                        : 0
                                )}
                            </Typography>
                            <BonusIcon mt={2} size={14} />
                        </View>
                        <Typography type="caption11" color="secondary">
                            за период
                        </Typography>
                    </View>
                </DonutChart>
            </View>

            <View style={styles.legend}>
                {segments.map((segment) => (
                    <HistoryChartLegendItem
                        key={segment.label}
                        color={segment.color}
                        label={segment.label}
                        value={segment.value}
                    />
                ))}
            </View>
        </GlassCard>
    )
})
