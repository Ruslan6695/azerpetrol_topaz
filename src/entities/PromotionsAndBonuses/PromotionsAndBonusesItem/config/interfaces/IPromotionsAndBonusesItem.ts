export interface IPromotionsAndBonusesItem {
    id: number
    img: string
    html_text: string
    date_create: string
    header: string
    page_link: null | string
    show_main: boolean
    show_modal:boolean
    // Вид карточки на главной. Поле опциональное: пока бэкенд его не отдаёт,
    // работает фолбэк — картинка, если есть img, иначе текстовая строка.
    view_type?: 'image' | 'text'
    // Надстрочник лаймом («Летнее предложение»). Фолбэк — «Акция».
    label?: string
    // Имя иконки текстовой строки из набора shared/Icons (например
    // 'home_coffee'). Неизвестное имя и пустое поле дают фолбэк
    // 'home_bonuses' — процент.
    icon?: string
}
