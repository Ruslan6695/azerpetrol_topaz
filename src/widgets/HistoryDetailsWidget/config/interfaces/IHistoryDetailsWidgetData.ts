export interface IHistoryDetailsWidgetData {
    date: string
    sum: number
    text: string
    receiver_name?: string
    receiver_phone?: string
    coffee_name?: string
    /** АЗС, где проведена операция — известна для налива/кофе/пополнения/оплаты через устройство */
    azs?: string | null
    /** Только для налива (FUEL_FILLING): через приложение или оплата QR на кассе Топаз */
    source?: 'app' | 'kassa'
    petrol?: {
        name: string
        price: number
        liters: number
    }
    products?: {
        count: number
        product_name: string
        sale: number // общая сумма за товар
        unit_name: string
    }[]
}
