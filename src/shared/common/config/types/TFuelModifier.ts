// Модификатор цены топлива: либо процент, либо рубли.
// Формат общий для скидки, кэшбека и бонусов — различает их TFuelModifierKind.
export type TFuelModifier = {
    type: 'percent' | 'rubles'
    value: number
}
