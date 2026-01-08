import { axiosIntsanse, getToken } from '../../../../shared'
import { IGetAzsListData } from '../config/interfaces/IGetAzsListData'
import { IGetColumnsData } from '../config/interfaces/IGetColumnsData'

export const selectAzsAndColumnApi = {
    getAzsList: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetAzsListData>('get_azs_list/', {
            params: { token },
        })
        return resp.data
    },
    getColumns: async ({ azs_id }: { azs_id: number }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetColumnsData>('get_trcs/', {
            params: { token, azs_id },
        })
        return resp.data
    },
}
