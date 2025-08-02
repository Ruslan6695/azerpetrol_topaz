import { ICoffeeItem } from '../../../../../entities/Coffee/CoffeeItem'

export interface IBuyCoffeWidgetData {
    coffee: ICoffeeItem[]
    bonus?:number
    balance:number
}
