import { axiosIntsanse, getToken } from '../../../../shared'
import { ISelectTrkTypeData } from '../config/interfaces/ISelectTrkTypeData'

export const selectTrkTypeApi = {
    getTrkTypes: async ({
        azsId,
        columnId,
    }: {
        azsId: number
        columnId: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<ISelectTrkTypeData>(
            'get_trc_types/',
            {
                params: { token, azs_id: azsId, trc_id: columnId },
            }
        )
        return resp.data
    },
}
