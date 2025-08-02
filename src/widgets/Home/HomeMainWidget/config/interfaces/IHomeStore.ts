import { IHomeMainwidgetData } from './IHomeMainwidgetData'

export interface IHomeStore {
    data: IHomeMainwidgetData | undefined
    texts: any
    setData: (data: IHomeMainwidgetData) => void
}
