// Шаги ветки налива на роуте /fuelLoading. Живёт в shared, потому что нужен
// и процессу, и виджетам, а импорт «снизу вверх» запрещён (см. TFuelRoad).
export type TFuelLoadingRoad = 'start' | 'fuelling' | 'end' | 'error'
