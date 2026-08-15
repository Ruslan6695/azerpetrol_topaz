import { axiosIntsanse, getToken } from '../../../../shared'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
import { IFuelLoadingFuellingData } from '../config/interfaces/IFuelLoadingFuellingData'

export const fuelLoadingFuellingApi = {
    getStatus: async ({ azsId, columnDevice }: IFuelLoadingFuellingArgs) => {
        const token = await getToken()

        const resp = await axiosIntsanse.get<IFuelLoadingFuellingData>(
            'fuelling/status/',
            {
                params: { token, azs: azsId, trc_id: columnDevice },
            }
        )
        return resp.data
    },
}
