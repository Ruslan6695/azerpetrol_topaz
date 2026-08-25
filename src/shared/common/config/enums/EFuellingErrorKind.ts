// Причины, по которым налив прерван — статусы заказа Топаз, которые
// не ведут на экран итогов, плюс собственный клиентский таймаут.
export enum EFuellingErrorKind {
    EXPIRED = 'EXPIRED',
    STATION_CANCELED = 'STATION_CANCELED',
    USER_CANCELED = 'USER_CANCELED',
    TIMEOUT = 'TIMEOUT',
}
