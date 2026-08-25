// Статусы заказа приходят от Топаз через наш сервер как есть (см.
// plans/topaz-fuelling-integration-design.md). Промежуточных состояний
// вроде «снимите пистолет» Топаз не даёт — этой детализации в статусе нет.
export enum EFuelOrderStatus {
    ORDER_CREATED = 'OrderCreated',
    ACCEPTED = 'Accepted',
    FUELING = 'Fueling',
    COMPLETED = 'Completed',
    EXPIRED = 'Expired',
    STATION_CANCELED = 'StationCanceled',
    USER_CANCELED = 'UserCanceled',
}
