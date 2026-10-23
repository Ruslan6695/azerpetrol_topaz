// Ответ сервера «приложение устарело» (HTTP 426 или проверка app_version/).
export interface IAppUpdate {
    message: string
    // Где скачать новую версию; '' — ссылку в панели не задали.
    url: string
}
