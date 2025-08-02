export interface IHistoryDetailsWidgetData {
    date: string
    sum: number
    text: string
    receiver_name?: string
    receiver_phone?: string
    coffee_name?: string
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
