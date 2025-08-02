import { IHistoryItem } from '../../../entities/History/HistoryItem'

export interface IHistoryWidgetGetItemsData {
    journal: IHistoryItem[]
    pages?: number
}
