import { IAppUpdate } from './IAppUpdate'

export interface IAppStore{
    isHasNet:boolean
    toggleIsHasNet: (isHasNet:boolean) => void
    isTokenRefreshed:boolean
    toggleIsTokenRefreshed:(refreshed:boolean) => void
    // Не null — сервер не обслуживает эту версию: вместо приложения экран обновления.
    appUpdate: IAppUpdate | null
    setAppUpdate: (appUpdate: IAppUpdate | null) => void
    // Разделы, выключенные в панели: маршрут → текст для клиента (с главного экрана).
    disabledSections: Record<string, string>
    setDisabledSections: (disabledSections: Record<string, string>) => void
}