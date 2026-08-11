import { TFuelModifier } from '../../../../entities/Fuel/FuelPriceRow'

// Элемент прайса из ответа get_fuel_prices/.
export interface IFuelPriceItem {
    id: number
    name: string
    price: number
    discount?: TFuelModifier
    bonus?: TFuelModifier
}
