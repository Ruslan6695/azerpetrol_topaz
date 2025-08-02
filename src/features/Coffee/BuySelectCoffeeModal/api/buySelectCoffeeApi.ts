import { axiosIntsanse, getToken } from '../../../../shared'

export const buySelectCoffeeApi = {
    buy: async ({
        bonus,
        productId,
        coffee_machine_id,
    }: {
        productId: number
        bonus: 0 | 1
        coffee_machine_id: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('v2/coffee/buy/', {
            params: { token, product_id: productId, bonus, coffee_machine_id },
        })
        return resp.data
    },
}
