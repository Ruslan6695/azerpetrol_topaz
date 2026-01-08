export interface IAppStore{
    isHasNet:boolean
    toggleIsHasNet: (isHasNet:boolean) => void
    isTokenRefreshed:boolean
    toggleIsTokenRefreshed:(refreshed:boolean) => void
}