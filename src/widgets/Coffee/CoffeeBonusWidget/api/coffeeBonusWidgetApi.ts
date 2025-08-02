import { axiosIntsanse, getToken } from '../../../../shared'
import { ICoffeBonusWidgetData } from '../config/interfaces/ICoffeBonusWidgetData'

export const coffeeBonusWidgetApi = {
    getCoffee: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<ICoffeBonusWidgetData>(
            'coffee/get_list/',
            {
                params: { token, bonus: 1},
            }
        )
        return resp.data
    },
}
