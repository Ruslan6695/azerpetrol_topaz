import { axiosIntsanse, getToken } from '../../../shared'
import { IPromotionsAndBonusesWidgetData } from '../config/interfaces/IPromotionsAndBonusesWidgetData'

export const promotionsAndBonusesWidgetApi = {
    getPromotions: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IPromotionsAndBonusesWidgetData>(
            'promotions/',
            { params: { token } }
        )
        return resp.data
    },
}
