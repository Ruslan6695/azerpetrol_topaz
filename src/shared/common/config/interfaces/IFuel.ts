import { TFuelModifier } from '../types/TFuelModifier'

export interface IAzs {
    id: string
    name: string
}

export interface IColumn {
    id: number
}

export interface IFuelOption {
    fuelId: string
    name: string
    price: number
    /** Скидка с цены литра */
    discount?: TFuelModifier
    /** Возврат деньгами за заправку */
    cashback?: TFuelModifier
    /** Начисление баллами за заправку */
    bonus?: TFuelModifier
}
