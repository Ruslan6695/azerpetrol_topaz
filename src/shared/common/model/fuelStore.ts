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
            fuelOption: null,
            fuelOnDebt: false,
            orderId: null,
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
        changeFuelOption(fuelOption) {
            set((state) => {
                state.state.fuelOption = fuelOption
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
        changeOrderId(orderId) {
            set((state) => {
                state.state.orderId = orderId
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

            if (!stored || isNaN(parsed) || parsed <= 0) return

            set((state) => {
                state.tankVolume = parsed
            })
        },
        clearState() {
            set((state) => {
                state.state.azs = null
                state.state.column = null
                state.state.fuelOption = null
                state.state.liters = null
                state.state.rubles = null
                state.state.fuelOnDebt = false
                state.state.orderId = null
            })
        },
    }))
)

export const FuelStore = createSelectorHooks(store)
