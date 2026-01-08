import { IUser } from './IUser'

export interface IUserStore {
    user: IUser | null
    balance: number
    getUserIsLoadung: boolean
    setBalance: (props: { balance: number }) => void
    setUser: (user: IUser) => void
    setToken: (token: string) => void
    registrationUser: (user: IUser) => void
    getUser: () => void
    logout: () => void
}
