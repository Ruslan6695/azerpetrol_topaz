import { EHistoryItemType } from '../../../entities/History'
import { axiosIntsanse, getToken } from '../../../shared'
import { IHistoryDetailsWidgetData } from '../config/interfaces/IHistoryDetailsWidgetData'

export const historyDetailsWidgetApi = {
    getDetails: async ({
        historyId,
        type,
    }: {
        type: EHistoryItemType
        historyId: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IHistoryDetailsWidgetData>(
            'history/detail/',
            {
                params: { token, type, id: historyId },
            }
        )
        return resp.data
    },
}
