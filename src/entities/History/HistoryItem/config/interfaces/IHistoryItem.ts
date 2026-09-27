import { EHistoryItemType } from '../../../config/enums/EHistoryItemType'

export interface IHistoryItem {
    type: EHistoryItemType
    text: string
    date: string
    sum: number
    header:string
    id:number
    /** АЗС, где проведена операция — только у пополнения/оплаты через устройство на кассе */
    azs_name?: string
}
