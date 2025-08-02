import { axiosIntsanse, getToken } from '../../../../shared'
import { IGetLocationOfAzsData } from '../config/interfaces/IGetLocationOfAzsData'

export const getLocationOfAzsApi = {
    getLocation: async ({ long, lat }: { long: Number; lat: number }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetLocationOfAzsData>(
            'get_azs_geo/',
            {
                params: { token, lon: long, lat },
            }
        )
        return resp.data
    },
}
