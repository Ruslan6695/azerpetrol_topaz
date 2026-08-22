import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IHistoryStore } from '../config/interfaces/IHistoryStore'

// Скроллом на внутренних экранах владеет InternalPagesLayout, а надевает его
// экран — значит колбэк «долистали до конца» нужен и экрану, и виджету.
// Прокидывать его пропами сверху вниз пришлось бы через оба слоя, поэтому
// событие передаётся счётчиком: экран дёргает requestLoadMore, виджет
// подписан на loadMoreTick.
const store = create<IHistoryStore>()(
    immer((set) => ({
        loadMoreTick: 0,
        requestLoadMore() {
            set((state) => {
                state.loadMoreTick += 1
            })
        },
    }))
)

export const HistoryStore = createSelectorHooks(store)
