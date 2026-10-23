import { IAppUpdate } from './IAppUpdate'

export interface IAppStore{
    isHasNet:boolean
    toggleIsHasNet: (isHasNet:boolean) => void
    isTokenRefreshed:boolean
    toggleIsTokenRefreshed:(refreshed:boolean) => void
    // Не null — сервер не обслуживает эту версию: вместо приложения экран обновления.
    appUpdate: IAppUpdate | null
    setAppUpdate: (appUpdate: IAppUpdate | null) => void
}