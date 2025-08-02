import { axiosIntsanse, getToken } from '../../../../shared'

export const fuelLoadingFuellingApi = {
    getStatus: async ({
        azsId,
        columnDevice,
    }: {
        columnDevice: number
        azsId: number
    }) => {
        const token = await getToken()

        const resp = await axiosIntsanse.get('fuelling/status/', {
            params: { token, azs: azsId, trc_id: columnDevice },
        })
        return resp.data
    },
}
