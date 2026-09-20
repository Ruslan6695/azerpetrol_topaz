// Раньше здесь был чужой домен вендора-первоисточника (21vek.azs-control.ru,
// демо/шаблон, из которого изначально скопировано приложение) — контакты
// клиента (contactsApi.checkIsContacts) реально уходили туда при каждой
// выдаче разрешения на контакты, а не на наш сервер. Должен совпадать с
// baseURL в axiosInstanse.ts.
export const DOMEN = "https://topaz.poteryashka.pro/adapters/primary/mobile_app/";
