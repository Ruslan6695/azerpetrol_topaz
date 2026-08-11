import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ITransferDraftStore } from '../config/interfaces/ITransferDraftStore'

// Черновик формы перевода. Выбор контакта — это router.navigate на отдельный
// экран, после которого виджет перемонтируется с новыми route-параметрами и
// локальный state теряется. Стор модульный, поэтому переживает перемонтирование:
// пользователь возвращается с контактов к уже введённой сумме.
const store = create<ITransferDraftStore>()(
    immer((set) => ({
        phone: '',
        sum: 0,
        setPhone(phone) {
            set((state) => {
                state.phone = phone
            })
        },
        setSum(sum) {
            set((state) => {
                state.sum = sum
            })
        },
        reset() {
            set((state) => {
                state.phone = ''
                state.sum = 0
            })
        },
    }))
)

export const TransferDraftStore = createSelectorHooks(store)
