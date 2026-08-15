import { ICoffeeMachineItem } from '../../../../../entities/Coffee/CoffeeMachineRow'
import { IGetCoffeeMachinesData } from './IGetCoffeeMachinesData'

export interface ICoffeeMachinesStore {
    coffeeMachines: ICoffeeMachineItem[] | null
    getCoffeeMachines: () => Promise<IGetCoffeeMachinesData>
    error: string | null
    isLoading: boolean
}
