import { axiosIntsanse, getToken } from '../../../../shared'
import { IPayBalanceFormData } from '../config/interfaces/IPayBalanceFormData'

export const payBalanceFormApi = {
    pay: async (sum: number) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IPayBalanceFormData>(
            'balance_pay/',
            {
                params: { token, sum },
            }
        )
        return resp.data
    },
}
