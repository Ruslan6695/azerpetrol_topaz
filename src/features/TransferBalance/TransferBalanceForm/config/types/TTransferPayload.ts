// Что форма отдаёт наружу при подтверждении перевода. Имя приходит с экрана
// контактов и может отсутствовать, если телефон введён руками.
export type TTransferPayload = {
    name?: string
    phone: string
    sum: number
}
