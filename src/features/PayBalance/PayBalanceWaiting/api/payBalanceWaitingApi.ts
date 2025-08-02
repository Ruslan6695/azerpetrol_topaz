import { axiosIntsanse, getToken } from '../../../../shared'
import { IPayBalanceWaitingData } from '../config/interfaces/IPayBalanceWaitingData'

export const payBalanceWaitingApi = {
    checkIsSuccess: async ({ pay_id }: { pay_id: number }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IPayBalanceWaitingData>(
            'balance/pay_success/',
            { params: { token, pay_id } }
        )
        return resp.data
    },
}
