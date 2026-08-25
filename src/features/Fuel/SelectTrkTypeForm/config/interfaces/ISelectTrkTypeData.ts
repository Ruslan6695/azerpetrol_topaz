import { IFuelOption } from '../../../../../shared'

export interface ISelectTrkTypeData {
    fuel_options: IFuelOption[]
    balance: number
    bonus_balance: number
    fuel_on_debt: boolean
}
