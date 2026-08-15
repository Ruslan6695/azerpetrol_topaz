import { EFuelLoadingFuellingStatuses } from '../enums/EFuelLoadingFuellingStatuses'

// Терминальные статусы (complete/error/locked) сюда не попадают — на них
// поллинг уводит с экрана, показывать их подписью нечего.
export const FUELLING_STATUS_TEXTS: Partial<
    Record<EFuelLoadingFuellingStatuses, string>
> = {
    [EFuelLoadingFuellingStatuses.FUELLING]: 'Идёт налив…',
    [EFuelLoadingFuellingStatuses.IDLE]: 'Ожидаем колонку…',
    [EFuelLoadingFuellingStatuses.HALTED]: 'Налив приостановлен',
}

// Пока первый ответ статуса не пришёл.
export const FUELLING_STATUS_PENDING_TEXT = 'Подключаемся к колонке…'
