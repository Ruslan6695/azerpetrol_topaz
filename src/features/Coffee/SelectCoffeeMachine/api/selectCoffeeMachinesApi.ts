import { axiosIntsanse, getToken } from '../../../../shared'
import { IGetCoffeeMachinesData } from '../config/interfaces/IGetCoffeeMachinesData'

export const selectCoffeeMachinesApi = {
    getCoffeeMachines: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetCoffeeMachinesData>(
            'coffee/get_coffee_machines/',
            {
                params: { token },
            }
        )
        return resp.data
    },
}
