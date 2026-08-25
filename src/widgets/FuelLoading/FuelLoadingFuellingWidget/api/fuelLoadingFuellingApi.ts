import { axiosIntsanse, getToken } from '../../../../shared'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
import { IFuelLoadingFuellingData } from '../config/interfaces/IFuelLoadingFuellingData'

export const fuelLoadingFuellingApi = {
    getStatus: async ({ orderId }: IFuelLoadingFuellingArgs) => {
        const token = await getToken()

        const resp = await axiosIntsanse.get<IFuelLoadingFuellingData>(
            'fuelling/status/',
            { params: { token, order_id: orderId } }
        )
        return resp.data
    },
}
