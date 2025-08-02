import { axiosIntsanse, getToken } from '../../../../shared'
import { IConfirmAddJoinAccountModalGetInfoData } from '../config/interfaces/IConfirmAddJoinAccountModalGetInfoData'

export const confirmAddJoinAccountModalApi = {
    getInfo: async () => {
        const token = await getToken()
        const resp =
            await axiosIntsanse.get<IConfirmAddJoinAccountModalGetInfoData>(
                'profile/join_accounts/invite/',
                { params: { token } }
            )
        return resp.data
    },
    confirm: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get(
            'profile/join_accounts/invite/confirm/',
            {
                params: { token },
            }
        )
        return resp.data
    },
    abort: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get(
            'profile/join_accounts/invite/abort/',
            {
                params: { token },
            }
        )
        return resp.data
    },
}
