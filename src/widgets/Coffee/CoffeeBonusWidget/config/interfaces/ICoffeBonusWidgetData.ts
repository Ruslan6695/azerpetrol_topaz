import { ICoffeeItem } from '../../../../../entities/Coffee/CoffeeItem'

export interface ICoffeBonusWidgetData {
    coffee: ICoffeeItem[]
    bonus?: number
}
