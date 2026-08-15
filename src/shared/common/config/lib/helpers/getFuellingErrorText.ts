import { EFuellingErrorKind } from '../../enums/EFuellingErrorKind'

const TEXTS: Record<
    EFuellingErrorKind,
    { title: string; description: string }
> = {
    [EFuellingErrorKind.PUMP_ERROR]: {
        title: 'Ошибка колонки',
        description:
            'Колонка сообщила об ошибке. Проверьте пистолет и обратитесь к оператору АЗС.',
    },
    [EFuellingErrorKind.LOCKED]: {
        title: 'Колонка заблокирована',
        description:
            'Колонка сейчас недоступна. Выберите другую или обратитесь к оператору АЗС.',
    },
    [EFuellingErrorKind.TIMEOUT]: {
        title: 'Колонка не отвечает',
        description:
            'Мы долго не получаем статус налива. Проверьте состояние колонки или обратитесь к оператору АЗС.',
    },
}

// Тексты ошибок налива берём здесь, а не сравнением статусов по месту.
export const getFuellingErrorText = (kind: EFuellingErrorKind) => TEXTS[kind]
