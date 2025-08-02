import { axiosIntsanse, getToken } from '../../../../shared'
import { IBuyCoffeWidgetData } from '../config/interfaces/IBuyCoffeWidgetData'

export const buyCoffeeWidgetApi = {
    getCoffee: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IBuyCoffeWidgetData>(
            'coffee/get_list/',
            {
                params: { token, bonus: 0 },
            }
        )
        return resp.data
    },
}
