import { EFuelLoadingFuellingStatuses } from '../enums/EFuelLoadingFuellingStatuses'

export interface IFuelLoadingFuellingData {
    volume: number
    price: number
    status: EFuelLoadingFuellingStatuses
    nozzle: string
}
