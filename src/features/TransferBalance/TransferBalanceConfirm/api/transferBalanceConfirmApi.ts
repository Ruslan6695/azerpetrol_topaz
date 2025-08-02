import { axiosIntsanse, getToken } from '../../../../shared'
import { ITransferBalanceGetClientData } from '../config/interfaces/ITransferBalanceGetClientData'

export const transferBalanceConfirmApi = {
    getClientInfo: async ({ phone }: { phone: string }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<ITransferBalanceGetClientData>(
            'balance/get_client/',
            {
                params: { token, phone },
            }
        )
        return resp.data
    },
    confirm: async ({
        transferId,
        sum,
    }: {
        transferId: number
        sum: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('balance/transfer/', {
            params: { token, receiver_id: transferId, sum },
        })

        return resp.data
    },
}
