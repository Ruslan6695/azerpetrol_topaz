export interface IBuySelectCoffeeArgs {
    productId: number
    /** 1 — списываем бесплатный напиток, 0 — покупаем за бонусы */
    bonus: 0 | 1
    coffee_machine_id: number
}
