# Спека: перевод налива в мобильном приложении на систему Топаз

Дата: 2026-08-25
Статус: согласовано с пользователем, ожидает написания implementation-плана

## Контекст

Мобильное приложение «Азерпетрол» сейчас запускает налив через бэкенд `21vek.azs-control.ru`, который прокси́рует напрямую хардварный контроллер ТРК (см. комментарий в `EFuelLoadingFuellingStatuses.ts`: значения статуса — сырые состояния железа `idle/nozzle_up/autorized/fuelling/complete/offline`, полный свитч в `core/mobile/mobile_start_fuelling.php` на бэкенде).

Задача — переключить налив на систему **Топаз** («Topaz Web Office», `topazoffice.ru`). У пользователя:
- уже куплена подписка на модуль «Внешние наливы» и выполнена первичная настройка интегратора (получен `apikey`, привязана сеть АЗС `azscontrol`);
- есть **собственный отдельный сервер** (новый проект, уже развёрнут, домен и IP есть), который будет посредником между Топаз и мобильным приложением — сам говорит с Топаз по их протоколу, а с мобильным приложением по новому контракту, спроектированному ниже;
- сервер и мобильное приложение пишет/дорабатывает сам пользователь; в этом репозитории (`mobile-azerpetrol`) меняется только клиентская часть.

## Согласованные решения

1. **Полная замена.** Старая система налива (прокси на контроллер ТРК) отключается целиком. Сосуществования двух систем не будет — упрощение архитектуры мобильного приложения не требует provider-абстракции.
2. **Сканирование убирается.** Идентификация колонки — ручной выбор из списка (АЗС → колонка → топливо), как уже фактически устроено в `SelectAzsAndColumnForm`. `widgets/Fuel/FuelScanBarcodeWidget` и связанный `scan_trc_qr/` удаляются.
3. **Контракт мобильное приложение ↔ сервер — свой, упрощённый**, а не зеркалирование полей Топазовского `Order`. Сервер сам собирает из упрощённых полей мобильного приложения полноценный `Order` для Топаза. Это решение подтверждено пользователем явно (вариант «Б» в обсуждении).
4. **Бонусная логика не трогается.** `discount/cashback/bonus` за литр, `balance`, `bonus_balance`, `fuel_on_debt` — собственная бизнес-логика проекта, не связана с Топаз, остаётся в том же виде, просто переезжает с идентификатора `art` на `fuelId`.
5. Старт налива — предлагается сменить с `GET` на `POST` (создание ресурса), т.к. эндпоинт теперь полностью свой. Не критично, если пользователь захочет оставить `GET` для симметрии со старым кодом.

## Протокол Топаз (справочно, реализует сервер — не мобильное приложение)

Не входит в объём изменений мобильного приложения, зафиксировано для полноты картины и потому что определяет форму данных, которые сервер сможет отдать мобильному приложению.

- Регистрация интегратора на `topazoffice.ru`, `apikey` передаётся в заголовке `externalSystemApikey`.
- `baseUrl` Топаз: `https://topazoffice.ru/ms/external-fueling/integration`.
- **Наш сервер → Топаз:**
  - `GET /station?apikey=` — список АЗС и колонок: `{id: string, enable: bool, name, address, location:{lat,lon}, columns: {[columnId:number]: {fuels: string[]}}}`
  - `GET /price?apikey=` — прайс-лист: `{stationId, productId, price, fuelExtendedId}[]`
  - `GET /ping?apikey=&stationId=&columnId=` — доступна ли колонка перед заказом (200/400/404)
  - `POST /order` — создание и обновление статуса заказа, тело `Order` (`Id, DateCreate, StationExtendedId, StationId?, OrderType(Money|Liters), ColumnId, FuelId, PriceFuel, Sum, Litre, SumPaid, Status, DateEnd, ReasonId, Reason, LitreCompleted, SumPaidCompleted, ContractId(Individual|Corporation), PayType`)
- **Топаз → наш сервер** (сервер обязан поднять эти эндпоинты, `x-www-form-urlencoded`, обязан отвечать `200 OK`):
  - `POST {ourUrl}/api/order/accept` — `apikey, orderId`
  - `POST {ourUrl}/api/order/fueling` — `apikey, orderId`
  - `POST {ourUrl}/api/order/canceled` — `apikey, orderId, reason`
  - `POST {ourUrl}/api/order/completed` — `apikey, orderId, litre, summ, extendedOrderId, extendedDate`
  - `POST {ourUrl}/api/order/volume` — `apikey, orderId, litre`, каждые 5–10 сек во время налива
- Регистрация интегратора требует указать домен сервера (`URL системы`, публично доступный, отдельно тест/прод) и исходящий публичный IP сервера (`Список IP адресов`, для файрвола Топаз, тоже отдельно тест/прод).

## Новый контракт: мобильное приложение ↔ сервер

| Шаг | Было | Станет | Ответ |
|---|---|---|---|
| Список АЗС | `GET get_azs_list/` | `GET fuelling/stations/` | `{ id: string, name, address, location }[]` |
| Колонки станции | `GET get_trcs/` | `GET fuelling/columns/?azs_id=` | `{ id: number }[]` |
| Топливо на колонке | `GET get_trc_types/` | `GET fuelling/fuel_types/?azs_id=&column_id=` | `{ fuelId, name, price, discount?, cashback?, bonus? }[]`, `balance`, `bonus_balance`, `fuel_on_debt` |
| Старт налива | `GET fuelling/start/` | `POST fuelling/start/` | тело `{ azsId, columnId, fuelId, price, sum }` → `{ orderId }` |
| Статус налива | `GET fuelling/status/` | `GET fuelling/status/?order_id=` | `{ status: EFuelOrderStatus, volume, sum, reason? }` |

Поллинг статуса — тот же паттерн, что в `useFuellingPolling` (интервал, `inFlightRef`, дедлайн 10 минут), интервал можно оставить 1с — сервер отдаёт последнее закэшированное значение независимо от частоты вебхука `Volume`.

## Модель данных

| Было | Станет | Почему |
|---|---|---|
| `IAzs.id: number` | `IAzs.id: string` | у Топаз id станции — строка |
| `IColumn{id, name, device}` | `IColumn{id: number}` | у Топаз колонка — номер в словаре `columns` станции, нет `device`, нет отдельного имени (отображаем «Колонка {id}») |
| `ITrkType{art, nozzle_id, petrol_id, price, name, discount?, cashback?, bonus?}` | `IFuelOption{fuelId: string, name, price, discount?, cashback?, bonus?}` | у Топаз нет «пистолета»/нозла — есть список `fuels` на колонке и цена из прайс-листа по `(stationId, fuelId)` |

## Статусы и ошибки налива

```ts
enum EFuelOrderStatus {
    ORDER_CREATED = 'OrderCreated',
    ACCEPTED = 'Accepted',
    FUELING = 'Fueling',
    COMPLETED = 'Completed',
    EXPIRED = 'Expired',
    STATION_CANCELED = 'StationCanceled',
    USER_CANCELED = 'UserCanceled',
}
```

| Статус | Реакция UI |
|---|---|
| `OrderCreated` / `Accepted` | текст «Готовим колонку…» |
| `Fueling` | текст «Идёт налив…» (как сейчас) |
| `Completed` | переход на `FuelLoadingEndWidget`, как сейчас |
| `Expired` | экран ошибки: «Колонка не ответила на заказ» |
| `StationCanceled` | экран ошибки, текст из `reason`, если сервер его передал |
| `UserCanceled` | экран ошибки: «Заказ отменён» |

`EFuellingErrorKind` меняется с `PUMP_ERROR/LOCKED/TIMEOUT` на `EXPIRED/STATION_CANCELED/USER_CANCELED/TIMEOUT` (таймаут — прежний клиентский дедлайн-гард на 10 минут, к протоколу Топаз отношения не имеет).

Уходят статусы `nozzle_up`/`autorized`/`halted`/`offline`/`locked` и их тексты в `FUELLING_STATUS_TEXTS` — Топаз такой детализации не отдаёт.

## Затронутые файлы

**Меняются:**
- `shared/common/config/interfaces/IFuel.ts` — `IAzs.id → string`, `IColumn` упрощается, `ITrkType → IFuelOption`
- `shared/common/config/interfaces/IFuelStore.ts`, `shared/common/model/fuelStore.ts` — типы под новую модель
- `features/Fuel/SelectAzsAndColumnForm/*` — `api`, интерфейсы `IGetAzsListData`/`IGetColumnsData`
- `features/Fuel/SelectTrkTypeForm/*` — `api`, интерфейс `ISelectTrkTypeData`, `ui/TrkTypeRow.tsx`
- `features/Fuel/SelectLiters/*` — `trkType.price/name → fuelOption.price/name`, логика не меняется
- `widgets/FuelLoading/FuelLoadingStartWidget/*` — `api`, тело запроса, метод `GET → POST`
- `widgets/FuelLoading/FuelLoadingFuellingWidget/*` — `api`, новый `EFuelOrderStatus`, `useFuellingPolling`, тексты статусов
- `widgets/FuelLoading/FuelLoadingEndWidget/*` — минимально, поля те же (`volume`, `sum`)
- `shared/common/config/enums/EFuellingErrorKind.ts`, `getFuellingErrorText.ts` — новые причины отмены

**Удаляются:**
- `widgets/Fuel/FuelScanBarcodeWidget/*` (весь слайс)
- `shared/common/config/enums/EFuelLoadingFuellingStatuses.ts` (заменяется `EFuelOrderStatus`)
- ссылки на сканирование в `proccesses/Fuel/ui/Fuel.tsx`, иконка `fuel_scan.svg` — если больше нигде не используется (проверить при реализации)

**Не меняются:** UI-кит (`AmountField`, `Slider`, `FuelBonusCard`, `ListRow`, ...), роутинг `ESCREENS.FUEL*`, `FuelLoadingScreen`/`FuelScreen`, композиция `proccesses/FuelLoading`.

## Тестирование и раскатка

В проекте нет автотестов и линта (см. `CLAUDE.md`). Проверка после реализации:
- `npx tsc --noEmit`, сравнение с текущими 5 фоновыми ошибками (новых быть не должно);
- ручная проверка на dev-билде против **тестового окружения** Топаз (у интегратора отдельно настраиваются тестовый и рабочий контуры);
- отчёт о работе — в `plans/`, по конвенции проекта.

## Открытые вопросы на момент написания спеки

- Нужно решить, разносить ли тестовый и боевой контуры сервера на разные домены/IP при регистрации в личном кабинете Топаз, или временно указать одинаковые (обсуждалось отдельно, решение за пользователем на этапе деплоя).
- Название слайса `SelectTrkTypeForm` можно оставить как есть (в проекте уже есть закреплённые опечатки-имена, см. `code-style.md`) или переименовать в `SelectFuelTypeForm` — уточнить на этапе реализации, чтобы не расширять blast radius сверх необходимого.
