export interface IMyCoffeeItem {
    id: number
    img: string | null
    name: string
    qr: string
    /** Кофемашина, на которой куплен напиток. Может не прийти — тогда подписи нет */
    coffee_machine_name: string | null
}
