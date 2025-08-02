import { ICoffeeMachineItem } from '../../../../../entities/Coffee/CoffeeMachineItem'
import { IGetCoffeeMachinesData } from './IGetCoffeeMachinesData'

export interface ICoffeeMachinesStore {
    coffeeMachines: ICoffeeMachineItem[] | null
    getCoffeeMachines: () => Promise<IGetCoffeeMachinesData>
    error: string | null
    isLoading: boolean
}
