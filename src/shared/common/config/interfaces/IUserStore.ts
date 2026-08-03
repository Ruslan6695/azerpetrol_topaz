import { IUser } from './IUser'

export interface IUserStore {
    user: IUser | null
    balance: number
    bonus_balance: number
    getUserIsLoadung: boolean
    /** Баланс скрыт «звёздочками». Переживает перезапуск приложения */
    isBalanceHidden: boolean
    setBalance: (props: { balance: number; bonus_balance: number }) => void
    toggleBalanceHidden: () => void
    setUser: (user: IUser) => void
    setToken: (token: string) => void
    registrationUser: (user: IUser) => void
    getUser: () => void
    logout: () => void
}
