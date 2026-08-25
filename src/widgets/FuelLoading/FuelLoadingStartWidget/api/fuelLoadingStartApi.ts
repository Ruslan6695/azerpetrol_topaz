import { axiosIntsanse, getToken } from '../../../../shared'
import { IFuelLoadingStartData } from '../config/interfaces/IFuelLoadingStartData'

export const fuelLoadingStartApi = {
    startFuelling: async ({
        azsId,
        columnId,
        fuelId,
        price,
        sumRub,
    }: {
        azsId: string
        columnId: number
        fuelId: string
        price: number
        sumRub: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.post<IFuelLoadingStartData>(
            'fuelling/start/',
            {
                azs_id: azsId,
                column_id: columnId,
                fuel_id: fuelId,
                price,
                sum: sumRub,
            },
            { params: { token } }
        )
        return resp.data
    },
}
