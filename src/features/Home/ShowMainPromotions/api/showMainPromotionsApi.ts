import { axiosIntsanse, getToken } from '../../../../shared'
import { IShowMainPromotionsData } from '../config/interfaces/IShowMainPromotionsData'

export const showMainPromotionsApi = {
    getPromotions: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IShowMainPromotionsData>(
            'promotions/',
            {
                params: { token },
            }
        )
        return resp.data
    },
}
