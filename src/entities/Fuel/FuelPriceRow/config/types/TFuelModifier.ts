// Скидка или кэшбек на топливо: либо процент от цены, либо рубли.
export type TFuelModifier = {
    type: 'percent' | 'rubles'
    value: number
}
