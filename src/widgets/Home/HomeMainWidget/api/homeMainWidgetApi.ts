import { axiosIntsanse, getToken } from '../../../../shared'

export const homeMainWidgetApi = {
    getHome: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('/home/', {
            params: { token },
        })
        return resp.data
    },
}
