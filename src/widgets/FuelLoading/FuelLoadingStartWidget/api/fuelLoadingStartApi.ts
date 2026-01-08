import { axiosIntsanse, getToken } from '../../../../shared'

export const fuelLoadingStartApi = {
    startFuelling: async ({
        azsId,
        columnDevice,
        sumRub,
        trkTypeArt,
        trkTypeName,
        trkTypeNozzleId,
        trkTypePetrolId,
        trkTypePrice,
    }: {
        azsId: number
        columnDevice: string
        trkTypeNozzleId: number
        trkTypePetrolId: number
        trkTypeArt: string
        trkTypeName: string
        trkTypePrice: number
        sumRub: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get('fuelling/start/', {
            params: {
                token,
                azs: azsId,
                trk_id: columnDevice,
                nozzle_id: trkTypeNozzleId,
                petrol_id: trkTypePetrolId,
                art: trkTypeArt,
                petrol_name: trkTypeName,
                price: trkTypePrice,
                sum: sumRub,
            },
        })
        return resp.data
    },
}
