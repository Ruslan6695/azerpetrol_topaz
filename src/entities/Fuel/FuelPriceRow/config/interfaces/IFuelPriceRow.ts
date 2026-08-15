import { TFuelModifier } from '../../../../../shared'

export interface IFuelPriceRow {
    name: string
    price: number
    /** Скидка с цены: рисуется перечёркнутой старой ценой */
    discount?: TFuelModifier
    /** Возврат деньгами */
    cashback?: TFuelModifier
    /** Начисление баллами */
    bonus?: TFuelModifier
    /** Единица цены. '₽' по умолчанию, '₽/л' — на экране выбора топлива */
    unit?: string
    /** Задан → строка кликабельна. На экране цен не передаётся */
    onPress?: () => void
}
