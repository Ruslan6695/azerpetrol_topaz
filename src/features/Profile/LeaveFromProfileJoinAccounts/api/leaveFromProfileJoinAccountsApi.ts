import { axiosIntsanse, getToken } from '../../../../shared'

export const leaveFromProfileJoinAccountsApi = {
    leave: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('profile/join_accounts/leave/', {
            params: { token },
        })
        return resp.data
    },
}
