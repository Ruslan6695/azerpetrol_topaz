export interface IHistoryDetailsWidgetData {
    date: string
    sum: number
    text: string
    receiver_name?: string
    receiver_phone?: string
    coffee_name?: string
    /** АЗС, где проведена операция — известна только для пополнения/оплаты через устройство на кассе */
    azs?: string | null
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
