import { EHistoryItemType } from '../../../config/enums/EHistoryItemType'

export interface IHistoryItem {
    type: EHistoryItemType
    text: string
    date: string
    sum: number
    header:string
    id:number
}
