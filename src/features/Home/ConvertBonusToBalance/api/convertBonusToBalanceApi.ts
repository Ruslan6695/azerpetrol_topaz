import { axiosIntsanse, getToken } from '../../../../shared'
import { IConvertBonusData } from '../config/interfaces/IConvertBonusData'

export const convertBonusToBalanceApi = {
    convert: async ({ sum }: { sum: number }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IConvertBonusData>(
            'balance/convert_bonus/',
            {
                params: { token, sum },
            }
        )
        return resp.data
    },
}
