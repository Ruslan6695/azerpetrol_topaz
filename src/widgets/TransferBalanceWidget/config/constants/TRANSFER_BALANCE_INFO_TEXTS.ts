import { IInfoCard } from '../../../../entities/InfoCard'
import { AZS_NAME, PARTNER_STORE_NAME } from '../../../../shared'

// Упоминание партнёра опускается целиком, если PARTNER_STORE_NAME пуст
// (не у каждого клиента при клонировании под новую сеть АЗС он есть).
const partnerStoreSuffix = PARTNER_STORE_NAME ? ` и ${PARTNER_STORE_NAME}` : ''

export const TRANSFER_BALANCE_INFO_TEXTS: IInfoCard[] = [
    {
        title: `Перевод средств на счет ${AZS_NAME}`,
        info: `Перевод средств выполняется только между пользователями приложения ${AZS_NAME}. Для этого вы можете выбрать пользователя из своей телефонной книги или найти по номеру телефона.`,
    },
    {
        title: `Данный перевод не на карту банка`,
        info: `Внутренний счет ${AZS_NAME} не позволяет переводить средства на счета банков. Счет создан для оплаты в сети ${AZS_NAME}${partnerStoreSuffix}.`,
    },
]
