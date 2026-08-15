import { axiosIntsanse, getToken } from '../../../../shared'
import { IBuySelectCoffeeArgs } from '../config/interfaces/IBuySelectCoffeeArgs'

export const buySelectCoffeeApi = {
    buy: async ({
        bonus,
        productId,
        coffee_machine_id,
    }: IBuySelectCoffeeArgs) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('v2/coffee/buy/', {
            params: { token, product_id: productId, bonus, coffee_machine_id },
        })
        return resp.data
    },
}
