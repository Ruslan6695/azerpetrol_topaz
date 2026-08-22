import { EFuelLoadingFuellingStatuses } from '../enums/EFuelLoadingFuellingStatuses'

// Терминальные статусы (complete/error/locked) сюда не попадают — на них
// поллинг уводит с экрана, показывать их подписью нечего. Статус idle тоже
// терминальный, но только после того, как налив уже шёл; до старта он значит
// «пистолет ещё на колонке», поэтому подпись у него осталась.
export const FUELLING_STATUS_TEXTS: Partial<
    Record<EFuelLoadingFuellingStatuses, string>
> = {
    [EFuelLoadingFuellingStatuses.FUELLING]: 'Идёт налив…',
    [EFuelLoadingFuellingStatuses.IDLE]: 'Ожидаем колонку…',
    [EFuelLoadingFuellingStatuses.HALTED]: 'Налив приостановлен',
    [EFuelLoadingFuellingStatuses.NOZZLE_UP]:
        'Снимите пистолет и вставьте в бак',
    [EFuelLoadingFuellingStatuses.AUTORIZED]: 'Колонка готова, начните налив',
    [EFuelLoadingFuellingStatuses.OFFLINE]: 'Нет связи с колонкой…',
}

// Пока первый ответ статуса не пришёл.
export const FUELLING_STATUS_PENDING_TEXT = 'Подключаемся к колонке…'
