import { THomeTexts } from '../types/THomeTexts'
import { IHomeMainwidgetData } from './IHomeMainwidgetData'

export interface IHomeStore {
    data: IHomeMainwidgetData | undefined
    texts: THomeTexts
    setData: (data: IHomeMainwidgetData) => void
}
