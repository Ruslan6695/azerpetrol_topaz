export interface IFuelPricesPriceBlock {
    id: number
    name: string
    discount?: { type: 'percent' | 'rubles'; value: number }
    bonus?: { type: 'percent' | 'rubles'; value: number }
    price: number
}
