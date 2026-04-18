import {
    axiosIntsanse,
    getPushNotificationToken,
} from '../../../shared'
import {
    ICallcheckLoginInitResponse,
    ICallcheckRegistrationInitResponse,
} from '../config/interfaces/ICallcheckInitResponse'
import { TCallcheckStatusResponse } from '../config/interfaces/ICallcheckStatusResponse'

export const callcheckApi = {
    initLogin: async ({
        phone,
        captchaToken,
    }: {
        phone: string
        captchaToken?: string
    }) => {
        const resp = await axiosIntsanse.get<ICallcheckLoginInitResponse>(
            'v2/auth/callcheck/',
            {
                params: {
                    phone,
                    captcha_token: captchaToken,
                },
            }
        )
        return resp.data
    },
    pollLoginStatus: async ({
        phone,
        checkId,
    }: {
        phone: string
        checkId: string
    }) => {
        const pushToken = await getPushNotificationToken()
        const resp = await axiosIntsanse.get<TCallcheckStatusResponse>(
            'v2/auth/callcheck/status/',
            {
                params: {
                    phone,
                    check_id: checkId,
                    push: pushToken,
                },
            }
        )
        return resp.data
    },
    initRegistration: async ({
        phone,
        name,
        surname,
        captchaToken,
    }: {
        phone: string
        name: string
        surname: string
        captchaToken?: string
    }) => {
        const resp =
            await axiosIntsanse.get<ICallcheckRegistrationInitResponse>(
                'v2/registration/callcheck/',
                {
                    params: {
                        phone,
                        name,
                        surname,
                        captcha_token: captchaToken,
                    },
                }
            )
        return resp.data
    },
    pollRegistrationStatus: async ({
        phone,
        checkId,
    }: {
        phone: string
        checkId: string
    }) => {
        const pushToken = await getPushNotificationToken()
        const resp = await axiosIntsanse.get<TCallcheckStatusResponse>(
            'v2/registration/callcheck/status/',
            {
                params: {
                    phone,
                    check_id: checkId,
                    push: pushToken,
                },
            }
        )
        return resp.data
    },
}
