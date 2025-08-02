import { IAzs, IColumn, ITrkType } from './IFuel'

export interface IFuelStore {
    state: {
        azs: IAzs | null
        column: IColumn | null
        trkType: ITrkType | null
        liters: number | null
        rubles: number | null
    }
    clearState:() => void
    changeAzs: (azs: IAzs) => void
    changeColumn: (column: IColumn) => void
    changeTrkType: (trkType: ITrkType) => void
    changeLitersAndRubles: ({
        liters,
        rubles,
    }: {
        rubles: number
        liters: number
    }) => void
}
