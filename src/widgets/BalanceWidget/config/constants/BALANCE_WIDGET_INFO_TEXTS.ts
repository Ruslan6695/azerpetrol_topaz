import { IInfoCard } from '../../../../entities/InfoCard'
import { AZS_NAME } from '../../../../shared'

export const BALANCE_WIDGET_INFO_TEXTS: IInfoCard[] = [
    {
        info: `Вы можете оплатить покупки на кассах сети ${AZS_NAME} и БигБазар`,
        title: 'С помощью данного кода',
    },
    {
        info: `Для оплаты со счета ${AZS_NAME} предоставьте QR-КОД кассиру либо самостоятельно отсканируйте его на кассе самообслуживания`,
        title: 'Просканируйте QR-КОД',
    },
]
