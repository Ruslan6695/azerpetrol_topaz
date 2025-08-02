import { axiosIntsanse, getToken } from '../../../shared'
import { IGetArticleData } from '../config/interfaces/IGetArticleData'

export const getArticleApi = {
    getArticle: async ({ id }: { id: number }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetArticleData>('article/', {
            params: { token, id },
        })
        return resp.data
    },
}
