import {
    APP_VERSION,
    IUser,
    axiosIntsanse,
    getPushNotificationToken,
    getToken,
} from '../../../shared'

export const loginWidgetApi = {
    sendCode: async ({ code, phone }: { code: string; phone: string }) => {
        const pushToken = await getPushNotificationToken()
        const resp = await axiosIntsanse.get<IUser>('auth/confirm/', {
            params: { code, phone, push: pushToken },
        })

        return resp.data
    },
    login: async ({ phone, type }: { phone: string; type: number }) => {
        const app_version = APP_VERSION
        const resp = await axiosIntsanse.get('auth/', {
            params: { phone, app_version, type },
        })
        return resp.data
    },
}
