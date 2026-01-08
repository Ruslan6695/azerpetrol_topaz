import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IShowPromotionsModalStore } from '../config/interfaces/IShowPromotionsModalStore'

const store = create<IShowPromotionsModalStore>()(
    immer((set) => ({
        promotions: [],
        isOpened: false,
        setPromotions(promotions) {
            set((state) => {
                state.promotions = promotions
            })
        },
        toggleIsOpened() {
            set((state) => {
                state.isOpened = true
            })
        },
    }))
)

export const ShowPromotionsModalStore = createSelectorHooks(store)
