import { getToken } from '../config/lib/asyncStorage/getToken'
import { axiosIntsanse } from './axiosInstanse'

export const userApi = {
    getBalance: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<{ balance: number }>(
            'get_balance/',
            {
                params: { token },
            }
        )
        return resp.data
    },
}
