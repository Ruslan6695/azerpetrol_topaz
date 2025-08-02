import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ICoffeeMachinesStore } from '../config/interfaces/ICoffeeMachinesStore'
import { selectCoffeeMachinesApi } from '../api/selectCoffeeMachinesApi'
import { showError } from '../../../../shared/ToastComponent'

const store = create<ICoffeeMachinesStore>()(
    immer((set) => ({
        coffeeMachines: null,
        error: null,
        isLoading: true,
        async getCoffeeMachines() {
            set((state) => {
                state.isLoading = true
                state.error = null
            })
            try {
                const data = await selectCoffeeMachinesApi.getCoffeeMachines()
                set((state) => {
                    state.coffeeMachines = data.coffee_machines
                })
                return data
            } catch (error: any) {
                set((state) => {
                    state.error =
                        error?.response?.data ||
                        'Произошла ошибка при загрузке кофемашин'
                })
                return { coffee_machines: [] }
            } finally {
                setTimeout(() => {
                    set((state) => {
                        state.isLoading = false
                    })
                }, 10)
            }
        },
    }))
)

export const CoffeeMachinesStore = createSelectorHooks(store)
