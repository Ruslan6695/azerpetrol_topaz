// Итоги налива приходят от колонки (fuelling/status/), а не считаются по
// trkType.price: фактический объём и цена — источник истины бэкенда.
// Живёт в shared, потому что нужен и процессу, и двум виджетам ветки налива,
// а импорт «снизу вверх» запрещён.
export interface IFuellingTotals {
    volume: number
    sum: number
}
