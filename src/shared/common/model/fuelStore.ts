import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DEFAULT_TANK_VOLUME } from '../config/constants/TANK_VOLUME'
import { EAsyncStoreKeys } from '../config/enums/EAsyncStoreKeys'
import { IFuelStore } from '../config/interfaces/IFuelStore'
import { getItemFromAsyncStorage } from '../config/lib/asyncStorage/getItemFromAsyncStorage'
import { setItemToAsyncStorage } from '../config/lib/asyncStorage/setItemToAsyncStorage'

const store = create<IFuelStore>()(
    immer((set) => ({
        tankVolume: DEFAULT_TANK_VOLUME,
        state: {
            azs: null,
            column: null,
            liters: null,
            rubles: null,
            trkType: null,
            fuelOnDebt: false,
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
        changeFuelOnDebt(fuelOnDebt) {
            set((state) => {
                state.state.fuelOnDebt = fuelOnDebt
            })
        },
        changeTankVolume(volume) {
            set((state) => {
                state.tankVolume = volume
                setItemToAsyncStorage({
                    key: EAsyncStoreKeys.TANK_VOLUME,
                    value: String(volume),
                })
            })
        },
        async getTankVolume() {
            const stored = await getItemFromAsyncStorage(
                EAsyncStoreKeys.TANK_VOLUME
            )
            const parsed = Number(stored)

            // Ничего не сохранено или в хранилище мусор — оставляем дефолт.
            if (!stored || isNaN(parsed) || parsed <= 0) return

            set((state) => {
                state.tankVolume = parsed
            })
        },
        clearState() {
            set((state) => {
                state.state.azs = null
                state.state.column = null
                state.state.liters = null
                state.state.fuelOnDebt = false
            })
        },
    }))
)

export const FuelStore = createSelectorHooks(store)
