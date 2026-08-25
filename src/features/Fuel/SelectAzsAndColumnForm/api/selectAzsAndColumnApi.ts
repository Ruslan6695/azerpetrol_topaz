 import { axiosIntsanse, getToken } from '../../../../shared'
import { IGetAzsListData } from '../config/interfaces/IGetAzsListData'
import { IGetColumnsData } from '../config/interfaces/IGetColumnsData'

export const selectAzsAndColumnApi = {
    getAzsList: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetAzsListData>(
            'fuelling/stations/',
            { params: { token } }
        )
        return resp.data
    },
    getColumns: async ({ azs_id }: { azs_id: string }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetColumnsData>(
            'fuelling/columns/',
            { params: { token, azs_id } }
        )
        return resp.data
    },
}
