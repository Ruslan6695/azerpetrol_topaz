// Границы налива заданы клиентом: в API их нет, а в макете это литералы.
export const MIN_LITERS = 1
export const LITERS_STEP = 0.5
// Пресеты чипов из макета (dc.html:546–549). «Полный бак» берётся
// из настроек пользователя (FuelStore.tankVolume), а не из числа 45.
export const LITERS_PRESETS = [10, 20, 30]
