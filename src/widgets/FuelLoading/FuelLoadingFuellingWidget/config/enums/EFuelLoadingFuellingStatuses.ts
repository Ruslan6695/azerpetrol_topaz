// Значения приходят как есть от контроллера ТРК (fuelling/status/ — прокси
// его hardware-эндпоинта). Полный набор виден по switch в
// core/mobile/mobile_start_fuelling.php на бэкенде: idle, nozzle_up,
// autorized, fuelling, complete, offline. HALTED/LOCKED/ERROR железо не
// отдаёт, но они остаются как заготовка под нормализацию статуса на сервере.
export enum EFuelLoadingFuellingStatuses {
    COMPLETE = 'complete',
    FUELLING = 'fuelling',
    HALTED = 'halted',
    LOCKED = 'locked',
    ERROR = 'error',
    IDLE = 'idle',
    /** Рукав снят — колонка ждёт авторизации заказа */
    NOZZLE_UP = 'nozzle_up',
    /** Заказ авторизован, налив ещё не начался. Опечатка — так на контроллере */
    AUTORIZED = 'autorized',
    OFFLINE = 'offline',
}
