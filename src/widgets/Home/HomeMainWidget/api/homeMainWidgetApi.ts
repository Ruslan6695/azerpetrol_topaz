import {
    axiosIntsanse,
    getPushNotificationToken,
    getToken,
} from '../../../../shared'
import { IHomeRefreshTokenData } from '../config/interfaces/IHomeRefreshTokenData'

export const homeMainWidgetApi = {
    getHome: async () => {
        const pushToken = await getPushNotificationToken()
        const token = await getToken()
        const resp = await axiosIntsanse.get('/home/', {
            params: { token, push: pushToken },
        })
        return resp.data
    },
    refreshToken: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IHomeRefreshTokenData>(
            'refresh_token/',
            {
                params: { token },
            }
        )
        return resp.data
    },
}
