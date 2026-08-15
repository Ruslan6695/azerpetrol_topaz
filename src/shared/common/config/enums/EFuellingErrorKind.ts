// Причины, по которым налив прерван. Отделены от EFuelLoadingFuellingStatuses:
// статусы описывают, что сейчас с колонкой, а kind — что показать пользователю
// (в том числе таймаут, которого среди статусов бэкенда нет).
export enum EFuellingErrorKind {
    PUMP_ERROR = 'PUMP_ERROR',
    LOCKED = 'LOCKED',
    TIMEOUT = 'TIMEOUT',
}
