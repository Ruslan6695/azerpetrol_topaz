import { axiosIntsanse, getToken } from '../../../shared'
import { IProfileData } from '../config/interfaces/IProfileData'

export const profileApi = {
    getProfileInfo: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IProfileData>('profile/', {
            params: { token },
        })
        return resp.data
    },
}
