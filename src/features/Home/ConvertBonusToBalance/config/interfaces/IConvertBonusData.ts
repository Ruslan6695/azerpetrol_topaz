// Ответ перевода бонусов на основной счёт. Оба баланса возвращаются уже
// пересчитанными, чтобы не делать отдельный запрос за обновлением.
export interface IConvertBonusData {
    balance: number
    bonus_balance: number
}
