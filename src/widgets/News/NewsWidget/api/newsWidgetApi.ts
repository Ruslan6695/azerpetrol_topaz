import { axiosIntsanse, getToken } from '../../../../shared'
import { INewsWidgetApiData } from '../config/interfaces/INewsWidgetApiData'

export const newsWidgetApi = {
    getNews: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<INewsWidgetApiData>('news/', {
            params: { token },
        })
        return resp.data
    },
}
