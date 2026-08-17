import { EHistoryItemType } from '../../../entities/History'
import { divideNumber } from '../../../shared'
import { IHistoryDetailsRow } from '../config/interfaces/IHistoryDetailsRow'
import { IHistoryDetailsWidgetData } from '../config/interfaces/IHistoryDetailsWidgetData'

// Макет (dc.html:320–324) показывает детали любой операции одной группой
// строк ключ/значение, причём набор ключей свой у каждого типа. Бэкенд отдаёт
// типизированный объект, поэтому раскладку по строкам собираем здесь.
//
// Неизвестный тип и недогруженные поля дают пустой массив, а не падение:
// типов операций у бэка может стать больше, чем в EHistoryItemType.
export function buildDetailsRows(
    type: EHistoryItemType | undefined,
    data: IHistoryDetailsWidgetData | undefined
): IHistoryDetailsRow[] {
    if (!data) {
        return []
    }

    switch (type) {
        case EHistoryItemType.FUEL_FILLING: {
            if (!data.petrol) {
                return []
            }

            return [
                { k: 'Топливо', v: data.petrol.name },
                { k: 'Цена за литр', v: divideNumber(data.petrol.price) },
                { k: 'Литры', v: `${divideNumber(data.petrol.liters)} л` },
                { k: 'Списано', v: divideNumber(data.sum) },
            ]
        }

        case EHistoryItemType.BUY_COFFEE: {
            if (!data.coffee_name) {
                return []
            }

            return [
                { k: 'Напиток', v: data.coffee_name },
                { k: 'Списано', v: divideNumber(data.sum) },
            ]
        }

        case EHistoryItemType.TRANSFER_BALANCE: {
            const rows: IHistoryDetailsRow[] = []

            if (data.receiver_name) {
                rows.push({ k: 'Получатель', v: data.receiver_name })
            }
            if (data.receiver_phone) {
                rows.push({ k: 'Телефон', v: data.receiver_phone })
            }
            rows.push({ k: 'Списано', v: divideNumber(data.sum) })

            return rows
        }

        case EHistoryItemType.PAY_BALANCE: {
            return [{ k: 'Зачислено', v: divideNumber(data.sum) }]
        }

        case EHistoryItemType.BUY_ON_CASH: {
            if (!data.products) {
                return []
            }

            return [
                ...data.products.map((product) => ({
                    k: `${product.product_name} — ${divideNumber(product.count)} ${product.unit_name}`,
                    v: divideNumber(product.sale),
                })),
                { k: 'Итого', v: divideNumber(data.sum) },
            ]
        }

        default:
            return []
    }
}
