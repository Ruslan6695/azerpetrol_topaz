import { EHistoryItemType } from '../../../config/enums/EHistoryItemType'

export interface IHistoryItem {
    type: EHistoryItemType
    text: string
    date: string
    sum: number
    header:string
    id:number
    /** АЗС, где проведена операция — известна не для всех типов (напр. перевод её не несёт) */
    azs_name?: string
}
