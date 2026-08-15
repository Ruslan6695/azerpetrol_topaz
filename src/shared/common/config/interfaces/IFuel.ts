import { TFuelModifier } from '../types/TFuelModifier'

export interface IAzs {
    id: number
    name: string
}
export interface ITrkType {
    name: string
    id: number
    price: number
    nozzle_id: number
    art: string
    petrol_id: number
    /** Скидка с цены литра */
    discount?: TFuelModifier
    /** Возврат деньгами за заправку */
    cashback?: TFuelModifier
    /** Начисление баллами за заправку */
    bonus?: TFuelModifier
}
export interface IColumn {
    id: number
    name: string
    device: string
}
