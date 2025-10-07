import { IFuelPricesPriceBlock } from '../../../../entities/FuelPrices/FuelPricesPriceBlock'
import { IInfoBlock } from '../../../../entities/InfoBlock'

export interface IFuelPricesWidgetData {
    prices: IFuelPricesPriceBlock[]
    info: IInfoBlock
}
