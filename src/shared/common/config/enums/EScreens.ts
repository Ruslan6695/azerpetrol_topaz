// Маршруты приложения. Намеренно не `enum`, а объект `as const`.
//
// В app.config.ts включён typedRoutes: expo-router принимает в push/navigate
// только строковые литералы существующих маршрутов. Член строкового enum'а
// компилятор считает отдельным номинальным типом и к литералу '/contacts' не
// приводит — из-за этого на каждый router.push(ESCREENS.X) приходилось писать
// @ts-ignore. У объекта `as const` значения и есть литералы, поэтому проверка
// маршрутов работает так, как задумано в navigation.md.
//
// Имя ESCREENS сохранено: оно стоит в ~50 файлах, а ниже объявлен одноимённый
// тип-union, поэтому и `ESCREENS.HOME` (значение), и `link: ESCREENS` (тип)
// продолжают работать без правок на местах.
export const ESCREENS = {
    LOGIN: '/login',
    REGISTRATION: '/registration',
    HOME: '/home',
    BALANCE: '/balance',
    FUEL: '/fuel',
    FUEL_LOADING: '/fuelLoading',
    PRODUCTS: '/products',
    PROFILE: '/profile',
    PAY_BALANCE: '/pay_balance',
    TRANSFER_BALANCE: '/transferBalance',
    ADD_JOIN_AСCOUNT: '/add_join_account',
    SUCCESS: '/success',
    CONTACTS: '/contacts',
    COFFEE: '/coffee',
    FUEL_PRICES: '/fuel_prices',
    COFFEE_BONUS: '/coffee_bonus',
    HELP: '/help',
    HISTORY: '/history',
    HISTORY_DETAILS: '/history_details',
    PROMOTIONS_AND_BONUSES: '/bonuses',
    PROMOTIONS_AND_BONUSES_DETAILS: '/bonuses/details',
    NEWS: '/news',
    NEWS_DETAILS: '/news/details',
    ABOUT_APP: '/about_app',
    ABOUT_COMPANY: '/about_company',
    SETTINGS: '/settings',
    DELETE_ACCOUNT: '/delete_account',
} as const

// Union всех маршрутов. Им типизируются route-параметры (TSuccessScreenParams,
// TContactsScreenParams, TPayBalanceScreenParams) и пропы link у пунктов меню.
export type ESCREENS = (typeof ESCREENS)[keyof typeof ESCREENS]
