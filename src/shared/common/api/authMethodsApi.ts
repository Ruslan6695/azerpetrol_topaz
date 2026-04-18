import { EAuthMethod } from '../config/enums/EAuthMethod'
import { axiosIntsanse } from './axiosInstanse'

export const authMethodsApi = {
    getAuthMethods: async () => {
        const resp = await axiosIntsanse.get<{ methods: EAuthMethod[] }>(
            'v2/auth_methods/'
        )
        return resp.data
    },
}
