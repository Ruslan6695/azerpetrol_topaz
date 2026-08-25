import { EFuelOrderStatus } from '../enums/EFuelOrderStatus'

// Терминальные статусы (Completed / Expired / StationCanceled / UserCanceled)
// сюда не попадают — на них поллинг уводит с экрана.
export const FUELLING_STATUS_TEXTS: Partial<
    Record<EFuelOrderStatus, string>
> = {
    [EFuelOrderStatus.ORDER_CREATED]: 'Готовим колонку…',
    [EFuelOrderStatus.ACCEPTED]: 'Готовим колонку…',
    [EFuelOrderStatus.FUELING]: 'Идёт налив…',
}

export const FUELLING_STATUS_PENDING_TEXT = 'Подключаемся к колонке…'
