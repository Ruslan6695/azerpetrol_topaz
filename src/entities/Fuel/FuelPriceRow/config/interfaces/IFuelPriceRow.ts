import { TFuelModifier } from '../types/TFuelModifier'

export interface IFuelPriceRow {
    name: string
    price: number
    discount?: TFuelModifier
    bonus?: TFuelModifier
    /** Единица цены. '₽' по умолчанию, '₽/л' — на экране выбора топлива */
    unit?: string
    /** Задан → строка кликабельна. На экране цен не передаётся */
    onPress?: () => void
}
