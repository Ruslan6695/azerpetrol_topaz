import {
    APP_VERSION,
    IUser,
    axiosIntsanse,
    getPushNotificationToken,
} from '../../../shared'
import { IRegistrationWidgetData } from '../config/interfaces/IRegistrationWidgetData'

export const registrationWidgetApi = {
    register: async ({
        name,
        phone,
        surname,
        type,
        captchaToken,
        regSession,
    }: {
        name: string
        phone: string
        surname: string
        type: number
        captchaToken?: string
        regSession?: string | null
    }) => {
        const app_version = APP_VERSION
        const resp = await axiosIntsanse.get<IRegistrationWidgetData>(
            'v2/registration/',
            {
                params: {
                    phone,
                    app_version,
                    name,
                    surname,
                    type,
                    captcha_token: captchaToken,
                    reg_session:regSession,
                },
            }
        )
        return resp.data
    },
    sendCode: async ({ code, phone }: { code: string; phone: string }) => {
        const pushToken = await getPushNotificationToken()
        const resp = await axiosIntsanse.get<IUser>('registration/confirm/', {
            params: { code, phone, push: pushToken },
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
