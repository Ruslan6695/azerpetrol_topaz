import { EFuellingErrorKind } from '../../enums/EFuellingErrorKind'

const TEXTS: Record<
    EFuellingErrorKind,
    { title: string; description: string }
> = {
    [EFuellingErrorKind.EXPIRED]: {
        title: 'Колонка не ответила',
        description:
            'Станция не подтвердила заказ вовремя. Попробуйте запустить налив ещё раз.',
    },
    [EFuellingErrorKind.STATION_CANCELED]: {
        title: 'Заказ отменён станцией',
        description: 'АЗС отменила заказ. Обратитесь к оператору АЗС.',
    },
    [EFuellingErrorKind.USER_CANCELED]: {
        title: 'Заказ отменён',
        description: 'Налив был отменён.',
    },
    [EFuellingErrorKind.TIMEOUT]: {
        title: 'Колонка не отвечает',
        description:
            'Мы долго не получаем статус налива. Проверьте состояние колонки или обратитесь к оператору АЗС.',
    },
}

// Причина от сервера (если пришла) точнее нашего общего текста — показываем её.
export const getFuellingErrorText = (
    kind: EFuellingErrorKind,
    reason?: string
) => {
    const base = TEXTS[kind]
    return reason ? { ...base, description: reason } : base
}
