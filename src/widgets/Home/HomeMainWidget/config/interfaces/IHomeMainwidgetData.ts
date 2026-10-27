export interface IHomeMainwidgetData {
    balance: number
    bonus_balance: number
    options: string[]
    texts: { link: string; small_text: string; big_text: string }[]
    coffee_bonus: number | null
    // Выключенные в панели разделы: маршрут → текст. Старый сервер поля не шлёт.
    disabled_sections?: Record<string, string>
    // Уровень лояльности (панель → «Группы» → «Уровни»); null/нет — уровни выключены
    // или клиент не в группе-уровне. next_* null — уровень высший или закреплён.
    level?: {
        name: string
        spent: number
        next_name: string | null
        next_threshold: number | null
    } | null
    // Минимум бонусов для перевода в рубли (панель → «Лимиты денег»);
    // null/нет — без минимума. Старый сервер поля не шлёт.
    bonus_convert_min?: number | null
}
