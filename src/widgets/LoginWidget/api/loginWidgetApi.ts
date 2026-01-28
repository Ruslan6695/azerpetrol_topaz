import {
    APP_VERSION,
    IUser,
    axiosIntsanse,
    getPushNotificationToken,
    getToken,
} from '../../../shared'
import { ILoginWidgetData } from '../config/interfaces/ILoginWidgetData'

export const loginWidgetApi = {
    sendCode: async ({ code, phone }: { code: string; phone: string }) => {
        const pushToken = await getPushNotificationToken()
        const resp = await axiosIntsanse.get<IUser>('auth/confirm/', {
            params: { code, phone, push: pushToken },
        })

        return resp.data
    },
    login: async ({
        phone,
        type,
        captchaToken,
        loginSession,
    }: {
        phone: string
        type: number
        captchaToken?: string
        loginSession?: string | null
    }) => {
        const app_version = APP_VERSION
        const resp = await axiosIntsanse.get<ILoginWidgetData>('v2/auth/', {
            params: {
                phone,
                app_version,
                type,
                captcha_token: captchaToken,
                login_session: loginSession,
            },
        })
        return resp.data
    },
    checkCaptchaEnabled: async () => {
        const resp = await axiosIntsanse.get<{ show_captcha: boolean }>(
            'check_captcha_enabled/'
        )
        return resp.data
    },
}
