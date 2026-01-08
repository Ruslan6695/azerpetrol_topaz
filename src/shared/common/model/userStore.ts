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
        getUserIsLoadung: true,
        setBalance({ balance }) {
            set((state) => {
                state.balance = balance
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
