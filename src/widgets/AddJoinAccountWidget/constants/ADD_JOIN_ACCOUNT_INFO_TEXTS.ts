import { IInfoBlock } from '../../../entities/InfoBlock'
import { CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS } from '../../../features/AddJoinAccount/ConfirmAddJoinAccountModal'

export const ADD_JOIN_ACCOUNT_INFO_TEXTS: IInfoBlock[] = [
    {
        title: `Выберите пользователя`,
        info: `Для привязки пользователя к общему счету выберите пользователя из контактов или найдите по номеру телефона.`,
    },
    {
        info: 'Деньги с вашего счета перенесутся в общий баланс. Вы в любой момент можете удалить другие аккаунты из общего счета.',
        title: 'Деньги не пропадут',
    },
    {
        info: 'После принятия все последущие операции уже будут производиться из общего баланса.',
        title: 'Все операции общие',
    },
]
