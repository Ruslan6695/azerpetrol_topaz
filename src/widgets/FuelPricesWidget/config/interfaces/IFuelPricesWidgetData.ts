import { IInfoCard } from '../../../../entities/InfoCard'
import { IFuelPriceItem } from './IFuelPriceItem'

export interface IFuelPricesWidgetData {
    prices: IFuelPriceItem[]
    /** Блок пояснения под списком. В ответе есть не всегда */
    info?: IInfoCard
}
