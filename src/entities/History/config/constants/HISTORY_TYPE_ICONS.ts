import { TIconName } from '../../../../shared/Icons'
import { EHistoryItemType } from '../enums/EHistoryItemType'

// Иконка в чипе суммы (dc.html:306). Под покупку на кассе макет иконки
// не рисует и в наборе «21 Век» её нет — берём ближайшую по смыслу
// (ценник с главной), см. отчёт plans/history-redesign-21vek.md.
export const HISTORY_TYPE_ICONS: Record<EHistoryItemType, TIconName> = {
    [EHistoryItemType.PAY_BALANCE]: 'wallet',
    [EHistoryItemType.TRANSFER_BALANCE]: 'person',
    [EHistoryItemType.FUEL_FILLING]: 'tab_fuel',
    [EHistoryItemType.BUY_COFFEE]: 'tab_coffee',
    [EHistoryItemType.BUY_ON_CASH]: 'home_prices',
}
