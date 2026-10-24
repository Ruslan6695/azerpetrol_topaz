export interface IHomeMainwidgetData {
    balance: number
    bonus_balance: number
    options: string[]
    texts: { link: string; small_text: string; big_text: string }[]
    coffee_bonus: number | null
    // Выключенные в панели разделы: маршрут → текст. Старый сервер поля не шлёт.
    disabled_sections?: Record<string, string>
}
