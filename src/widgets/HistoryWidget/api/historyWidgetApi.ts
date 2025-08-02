import { IGetHistoryPieChartData } from '../../../features/History/GetHistoryPieChart'
import { axiosIntsanse, getToken } from '../../../shared'
import { IHistoryWidgetGetItemsData } from '../config/IHistoryWidgetGetItemsData'

export const historyWidgetApi = {
    getHistoryPieChart: async ({
        end_date,
        start_date,
    }: {
        start_date?: string
        end_date?: string
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetHistoryPieChartData>(
            'history/chart/',
            {
                params: { token, date_end: end_date, date_start: start_date },
            }
        )
        return resp.data
    },
    getHistoryItems: async ({
        end_date,
        page,
        start_date,
    }: {
        page: number
        start_date?: string
        end_date?: string
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IHistoryWidgetGetItemsData>(
            'history/journal/',
            {
                params: {
                    token,
                    page,
                    date_end: end_date,
                    date_start: start_date,
                },
            }
        )
        return resp.data
    },
}
