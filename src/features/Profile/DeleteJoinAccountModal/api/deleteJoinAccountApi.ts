import { axiosIntsanse, getToken } from '../../../../shared'

export const deleteJoinAccountApi = {
    delete: async ({ accountId }: { accountId: number }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('profile/join_accounts/delete/', {
            params: { token, id: accountId },
        })
        return resp.data
    },
}
