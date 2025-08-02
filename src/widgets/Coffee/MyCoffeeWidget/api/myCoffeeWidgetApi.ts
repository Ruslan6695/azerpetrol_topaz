import { axiosIntsanse, getToken } from '../../../../shared'
import { IMyCoffeeWidgetData } from '../config/interfaces/IMyCoffeeWidgetData'

export const myCoffeeWidgetApi = {
    getCoffee: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IMyCoffeeWidgetData>(
            'coffee/my_coffee_list/',
            {
                params: { token },
            }
        )
        return resp.data
    },
}
