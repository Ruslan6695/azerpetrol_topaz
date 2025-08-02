import { axiosIntsanse, getToken } from '../../../../shared'
import { IFuelScanBarcodeWidgetData } from '../config/interfaces/IFuelScanBarcodeWidgetData'

export const fuelScanBarcodeWidgetApi = {
    scan: async ({ code }: { code: string }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IFuelScanBarcodeWidgetData>(
            `scan_trc_qr/?token=${token}&${code}`
        )
        return resp.data
    },
}
