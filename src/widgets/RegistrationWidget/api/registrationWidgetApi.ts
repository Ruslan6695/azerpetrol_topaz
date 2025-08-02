import {
    APP_VERSION,
    IUser,
    axiosIntsanse,
    getPushNotificationToken,
} from '../../../shared'

export const registrationWidgetApi = {
    register: async ({
        name,
        phone,
        surname,
        type,
    }: {
        name: string
        phone: string
        surname: string
        type: number
    }) => {
        const app_version = APP_VERSION
        const resp = await axiosIntsanse.get('registration/', {
            params: { phone, app_version, name, surname, type },
        })
        return resp.data
    },
    sendCode: async ({ code, phone }: { code: string; phone: string }) => {
        const pushToken = await getPushNotificationToken()
        const resp = await axiosIntsanse.get<IUser>('registration/confirm/', {
            params: { code, phone, push: pushToken },
        })
        return resp.data
    },
}
