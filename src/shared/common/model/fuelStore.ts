import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IFuelStore } from '../config/interfaces/IFuelStore'

const store = create<IFuelStore>()(
    immer((set) => ({
        state: {
            azs: null,
            column: null,
            liters: null,
            rubles: null,
            trkType: null,
        },
        changeAzs(azs) {
            set((state) => {
                state.state.azs = azs
            })
        },
        changeColumn(column) {
            set((state) => {
                state.state.column = column
            })
        },
        changeTrkType(trkType) {
            set((state) => {
                state.state.trkType = trkType
            })
        },
        changeLitersAndRubles({ liters, rubles }) {
            set((state) => {
                state.state.liters = liters
                state.state.rubles = rubles
            })
        },
        clearState() {
            set((state) => {
                state.state.azs = null
                state.state.column = null
                state.state.liters = null
            
            })
        },
    }))
)

export const FuelStore = createSelectorHooks(store)
