// Объём бака пользователя. Задаётся на экране Настроек и хранится локально
// (EAsyncStoreKeys.TANK_VOLUME) — в API такого поля нет.
// Границы подобраны по легковым авто, с заказчиком не согласованы.
export const DEFAULT_TANK_VOLUME = 50
export const MIN_TANK_VOLUME = 10
export const MAX_TANK_VOLUME = 200
export const TANK_VOLUME_PRESETS = [40, 50, 60, 70]
