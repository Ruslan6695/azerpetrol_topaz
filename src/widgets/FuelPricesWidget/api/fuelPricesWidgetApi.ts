import { axiosIntsanse, getToken } from '../../../shared'
import { IFuelPricesWidgetData } from '../config/interfaces/IFuelPricesWidgetData'

export const fuelPricesWidgetApi = {
    getPrices: async () => {
        const token = await getToken()
        const resp = axiosIntsanse.get<IFuelPricesWidgetData>(
            'get_fuel_prices/',
            { params: { token } }
        )
        return (await resp).data
    },
}
