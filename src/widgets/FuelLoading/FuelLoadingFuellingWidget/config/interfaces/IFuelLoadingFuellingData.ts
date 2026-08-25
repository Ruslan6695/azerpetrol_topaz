import { EFuelOrderStatus } from '../enums/EFuelOrderStatus'

export interface IFuelLoadingFuellingData {
    status: EFuelOrderStatus
    volume: number
    sum: number
    /** Причина отмены/просрочки от сервера, есть только на терминальных статусах отмены */
    reason?: string
}
