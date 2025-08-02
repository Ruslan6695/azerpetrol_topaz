import { EHistoryItemType } from '../../../../../entities/History'

export interface IGetHistoryPieChartData {
    chart: { total: number; type: EHistoryItemType }[]
    total_all: number
}
