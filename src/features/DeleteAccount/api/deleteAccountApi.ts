import { axiosIntsanse, getToken } from '../../../shared'

export const deleteAccountApi = {
    delete: async (type: number) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('profile/delete/', {
            params: { token, type },
        })
        return resp.data
    },
    confirm: async (code: string) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('profile/delete/confirm/', {
            params: { token, code },
        })
        return resp.data
    },
}
