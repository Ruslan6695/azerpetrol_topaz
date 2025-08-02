import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IFuelStore } from '../config/interfaces/IFuelStore'
import { IAppStore } from '../config/interfaces/IAppStore'

const store = create<IAppStore>()(
    immer((set) => ({
        isHasNet: true,
        toggleIsHasNet(isHasNet) {
            set((state) => {
                state.isHasNet = isHasNet
            })
        },
    }))
)

export const AppStore = createSelectorHooks(store)
