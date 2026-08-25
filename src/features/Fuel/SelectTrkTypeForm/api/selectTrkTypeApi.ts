import { axiosIntsanse, getToken } from '../../../../shared'
import { ISelectTrkTypeData } from '../config/interfaces/ISelectTrkTypeData'

export const selectTrkTypeApi = {
    getFuelOptions: async ({
        azsId,
        columnId,
    }: {
        azsId: string
        columnId: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<ISelectTrkTypeData>(
            'fuelling/fuel_types/',
            { params: { token, azs_id: azsId, column_id: columnId } }
        )
        return resp.data
    },
}
