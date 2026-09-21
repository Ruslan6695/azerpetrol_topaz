import { IInfoCard } from '../../../../entities/InfoCard'
import { AZS_NAME, PARTNER_STORE_NAME } from '../../../../shared'

// Упоминание партнёра опускается целиком, если PARTNER_STORE_NAME пуст
// (не у каждого клиента при клонировании под новую сеть АЗС он есть).
const partnerStoreSuffix = PARTNER_STORE_NAME ? ` и ${PARTNER_STORE_NAME}` : ''

export const BALANCE_WIDGET_INFO_TEXTS: IInfoCard[] = [
    {
        info: `Вы можете оплатить покупки на кассах сети ${AZS_NAME}${partnerStoreSuffix}`,
        title: 'С помощью данного кода',
    },
    {
        info: `Для оплаты со счета ${AZS_NAME} предоставьте QR-КОД кассиру либо самостоятельно отсканируйте его на кассе самообслуживания`,
        title: 'Просканируйте QR-КОД',
    },
]
