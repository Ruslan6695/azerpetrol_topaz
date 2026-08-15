import { TFuelModifier } from '../../types/TFuelModifier'
import { TFuelModifierKind } from '../../types/TFuelModifierKind'

const TITLES: Record<TFuelModifierKind, string> = {
    discount: 'Скидка',
    cashback: 'Кэшбек',
    bonus: 'Бонусы',
}

// Скидка, кэшбек и бонусы — разные вещи, поэтому у каждого свой текст.
// Формат один: либо процент от суммы, либо рубли.
export const formatFuelModifier = (
    kind: TFuelModifierKind,
    modifier: TFuelModifier,
    /** Единица для типа 'rubles'. Значения приходят за литр, отсюда дефолт */
    unit = '₽/л'
) => {
    const value =
        modifier.type === 'percent'
            ? `${modifier.value}%`
            : `${modifier.value} ${unit}`

    return `${TITLES[kind]} ${value}`
}

// Собирает заполненные модификаторы в порядке показа.
// Скидку на строке цены не перечисляют — её видно по перечёркнутой цене,
// поэтому список нужных типов передаётся аргументом.
export const collectFuelModifiers = (
    source: Partial<Record<TFuelModifierKind, TFuelModifier | undefined>>,
    kinds: TFuelModifierKind[]
) =>
    kinds
        .map((kind) => ({ kind, modifier: source[kind] }))
        .filter(
            (
                entry
            ): entry is { kind: TFuelModifierKind; modifier: TFuelModifier } =>
                Boolean(entry.modifier)
        )

// Сколько выйдет на конкретной заправке. Правило одно для всех трёх типов:
// 'percent' — процент от чека, 'rubles' — рубли **за литр**, поэтому
// умножаются на объём (2 ₽/л при 20 л — это 40 ₽, а не 2 ₽).
export const calcFuelModifierAmount = (
    modifier: TFuelModifier,
    price: number,
    liters: number
) => {
    const perLiter =
        modifier.type === 'percent'
            ? price * (modifier.value / 100)
            : modifier.value

    return Math.round(perLiter * liters)
}

const getBonusWord = (amount: number) => {
    const mod10 = amount % 10
    const mod100 = amount % 100

    if (mod10 === 1 && mod100 !== 11) {
        return 'бонус'
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return 'бонуса'
    }
    return 'бонусов'
}

// Текст для карточки выгоды на экране литров: «Начислим 58 бонусов».
// Число считает вызывающий — через calcFuelModifierAmount.
export const formatFuelModifierAmount = (
    kind: TFuelModifierKind,
    amount: number
) => {
    switch (kind) {
        case 'bonus':
            return `Начислим ${amount} ${getBonusWord(amount)}`
        case 'cashback':
            return `Вернём ${amount} ₽ кэшбеком`
        case 'discount':
            return `Вы сэкономите ${amount} ₽`
    }
}
