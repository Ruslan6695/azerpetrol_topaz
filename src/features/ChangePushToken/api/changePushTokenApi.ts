import {
    axiosIntsanse,
    getPushNotificationToken,
    getToken,
} from '../../../shared'

export const changePushTokenApi = {
    changeToken: async (pushToken: string) => {
        const token = await getToken()

        const resp = await axiosIntsanse.get('change_push_token/', {
            params: { token, push: pushToken },
        })
        return resp.data
    },
}
