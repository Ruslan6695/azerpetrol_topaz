import {
    axiosIntsanse,
    getPushNotificationToken,
    getToken,
} from '../../../../shared'
import { IHomeMainwidgetData } from '../config/interfaces/IHomeMainwidgetData'
import { IHomeRefreshTokenData } from '../config/interfaces/IHomeRefreshTokenData'

export const homeMainWidgetApi = {
    getHome: async () => {
        const pushToken = await getPushNotificationToken()
        const token = await getToken()
        const resp = await axiosIntsanse.get<IHomeMainwidgetData>('/home/', {
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
