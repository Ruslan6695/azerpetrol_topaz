import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IUserStore } from '../config/interfaces/IUserStore'
import { setItemToAsyncStorage } from '../config/lib/asyncStorage/setItemToAsyncStorage'
import { EAsyncStoreKeys } from '../config/enums/EAsyncStoreKeys'
import { getItemFromAsyncStorage } from '../config/lib/asyncStorage/getItemFromAsyncStorage'
import { removeItemFromAsyncStorage } from '../config/lib/asyncStorage/removeItemfromAsyncStorage'

const store = create<IUserStore>()(
    immer((set) => ({
        user: null,
        balance: 0,
        bonus_balance: 0,
        getUserIsLoadung: true,
        isBalanceHidden: false,
        setBalance({ balance, bonus_balance }) {
            set((state) => {
                state.balance = balance
                state.bonus_balance = bonus_balance
            })
        },
        toggleBalanceHidden() {
            set((state) => {
                state.isBalanceHidden = !state.isBalanceHidden
                setItemToAsyncStorage({
                    key: EAsyncStoreKeys.IS_BALANCE_HIDDEN,
                    value: String(state.isBalanceHidden),
                })
            })
        },
        async getUser() {
            set((state) => {
                state.getUserIsLoadung = true
            })
            try {
                const name = await getItemFromAsyncStorage(EAsyncStoreKeys.NAME)
                const token = await getItemFromAsyncStorage(
                    EAsyncStoreKeys.TOKEN
                )
                // Флаг скрытия баланса восстанавливаем здесь же: он должен
                // быть готов до первой отрисовки шапки и карточки.
                const isBalanceHidden = await getItemFromAsyncStorage(
                    EAsyncStoreKeys.IS_BALANCE_HIDDEN
                )

                set((state) => {
                    state.isBalanceHidden = isBalanceHidden === 'true'
                })

                if (name && token)
                    set((state) => {
                        state.user = { name, token }
                    })
            } catch (error) {
            } finally {
                set((state) => {
                    state.getUserIsLoadung = false
                })
            }
        },
        setUser(user) {
            console.info('USER', user)
            set((state) => {
                setItemToAsyncStorage({
                    key: EAsyncStoreKeys.NAME,
                    value: user.name,
                })
                setItemToAsyncStorage({
                    key: EAsyncStoreKeys.TOKEN,
                    value: user.token,
                })
                state.user = user
            })
        },
        setToken(token) {
            setItemToAsyncStorage({
                key: EAsyncStoreKeys.TOKEN,
                value: token,
            })
            set((state) => {
                if (state.user) state.user = { ...state.user, token: token }
            })
        },
        registrationUser(user) {
            set((state) => {
                setItemToAsyncStorage({
                    key: EAsyncStoreKeys.NAME,
                    value: user.name,
                })
                setItemToAsyncStorage({
                    key: EAsyncStoreKeys.TOKEN,
                    value: user.token,
                })
                state.user = user
            })
        },
        logout() {
            set((state) => {
                state.user = null
            })
            removeItemFromAsyncStorage(EAsyncStoreKeys.TOKEN)
            removeItemFromAsyncStorage(EAsyncStoreKeys.NAME)
        },
    }))
)

export const UserStore = createSelectorHooks(store)
