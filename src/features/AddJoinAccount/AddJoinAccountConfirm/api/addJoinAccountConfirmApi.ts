import { axiosIntsanse, getToken } from '../../../../shared'
import { IAddJoinAccountGetAccountInfoData } from '../config/IAddJoinAccountGetAccountInfoData'

export const addJoinAccountConfirmApi = {
    getAccountInfo: async ({ phone }: { phone: string }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IAddJoinAccountGetAccountInfoData>(
            'profile/join_accounts/get_account_info/',
            { params: { token, phone } }
        )
        return resp.data
    },
    confirm: async ({ accountId }: { accountId: number }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('profile/join_accounts/add/', {
            params: { token, id: accountId },
        })
        return resp.data
    },
}
