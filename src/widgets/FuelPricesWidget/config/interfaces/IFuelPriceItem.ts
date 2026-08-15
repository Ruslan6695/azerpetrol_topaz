import { TFuelModifier } from '../../../../shared'

// Элемент прайса из ответа get_fuel_prices/.
export interface IFuelPriceItem {
    id: number
    name: string
    price: number
    discount?: TFuelModifier
    cashback?: TFuelModifier
    bonus?: TFuelModifier
}
