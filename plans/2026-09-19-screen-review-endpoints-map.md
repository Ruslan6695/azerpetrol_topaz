# Ревью экранов — карта эндпоинтов (фронт → бэк)

Растущий список: каждый раз, когда по ходу постраничного ревью
(`2026-09-18-screen-review-frontend-bugs-backlog.md`) встречается вызов
`axiosIntsanse`, он фиксируется здесь — что фронт вызывает, каким файлом,
что реально исполняется на бэке (`azerpetrol-topaz-server`, боевой) и что
это значит для пользователя. Обновляется по ходу разбора, экран за экраном.

Базовый URL (`axiosIntsanse`) — `https://topaz.poteryashka.pro/adapters/primary/mobile_app/`.
Авторизация везде — query-параметр `token` (не заголовок).

## Home

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET /home/` | `widgets/Home/HomeMainWidget/api/homeMainWidgetApi.ts` | `adapters/primary/mobile_app/home/index.php` → `port_in_mobile_home($token)` | Данные главного экрана: баланс, бонусы, промо и т.д. Раньше не отдавал `bonus_balance` (сбрасывался на 0 при каждом фокусе экрана) — **пофикшено и задеплоено** (коммит `0a12d78`). |
| `GET refresh_token/` | `widgets/Home/HomeMainWidget/api/homeMainWidgetApi.ts` | `refresh_token/index.php` | Обновление клиентского токена. |
| `GET balance/convert_bonus/` | `features/Home/ConvertBonusToBalance/api/convertBonusToBalanceApi.ts` | `balance/convert_bonus/index.php` → `port_in_convert_mobile_bonus_to_balance($token,$sum)` | Перевод бонусов в баланс по кнопке на Home. |

## Fuel (мастер: способ оплаты → АЗС → колонка → топливо → литры)

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET get_balance/` | `shared/common/api/userApi.ts` | `get_balance/index.php` → `port_in_mobile_balance($token)` | Баланс + бонусы. Используется в 4 местах (Fuel/FuelLoading/экран «Баланс»/конец налива). Тот же баг `bonus_balance`, что и в `/home/` — **пофикшено и задеплоено** (коммит `82614a7`). |
| `GET get_azs_geo/` | `features/Fuel/GetLocationOfAzs/api/getLocationOfAzsApi.ts` | `get_azs_geo/index.php` → `port_in_azs_list($token,$lat,$lon)` | Подбор ближайшей АЗС по геолокации. **Легаси**: отдаёт старый числовой id станции, несовместимый со строковым id станций Топаз — фронт сознательно игнорирует результат (`handleSelectGeoAzs = () => {}`), запрос уходит впустую. Тост при этом лжёт, что станция подставится сама — записано в бэклог фронтенд-багов. |
| `GET fuelling/stations/` | `features/Fuel/SelectAzsAndColumnForm/api/selectAzsAndColumnApi.ts` | `fuelling/stations/index.php` → `topaz_stations_list()` → таблица `topaz_stations` | Список АЗС. Не бьёт в Топаз напрямую на каждый запрос — читает локальный кэш, который каждые ~3-5 мин наполняет `cron/topaz_sync.php` реальными `GET /station` к Топазу. Подтверждено живьём 2026-09-19 (см. память `topaz-station-columns-manual-toggle`). |
| `GET fuelling/columns/?azs_id=` | `features/Fuel/SelectAzsAndColumnForm/api/selectAzsAndColumnApi.ts` | `fuelling/columns/index.php` → `topaz_columns_list($azs_id)` → таблица `topaz_station_fuels` | Список колонок (ТРК) станции — из того же кэша. Отдельного понятия «рукав» в протоколе Топаза нет: топливо привязано прямо к колонке. |
| `GET fuelling/fuel_types/?azs_id=&column_id=` | `features/Fuel/SelectTrkTypeForm/api/selectTrkTypeApi.ts` | `fuelling/fuel_types/index.php` → `topaz_fuel_types($client_id,$azs_id,$column_id)` | Виды топлива на конкретной колонке + текущий баланс/бонусы клиента. Цены — из кэша `topaz_prices` (тот же крон). |

## FuelLoading (старт налива → поллинг статуса → отмена/завершение)

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `POST fuelling/start/` | `widgets/FuelLoading/FuelLoadingStartWidget/api/fuelLoadingStartApi.ts` | `fuelling/start/index.php` → `port_in_topaz_start_fuelling(...)` | Создание заказа налива (`POST /order` в Топаз). Перед созданием отдельно идёт живой `GET /ping` к Топазу — проверка, что колонка сейчас реально свободна. |
| `GET fuelling/status/?order_id=` | `widgets/FuelLoading/FuelLoadingFuellingWidget/api/fuelLoadingFuellingApi.ts` | `fuelling/status/index.php` → `port_in_topaz_fuelling_status(...)` | Поллинг статуса заказа (интервал — на фронте, см. виджет). Дополнительно есть фоновая живая сверка с Топазом (`topaz_reconcile_order_with_topaz`) на случай пропущенного вебхука. |
| `POST fuelling/cancel/` | `widgets/FuelLoading/FuelLoadingFuellingWidget/api/fuelLoadingFuellingApi.ts` | `fuelling/cancel/index.php` → `port_in_topaz_cancel_fuelling(...)` | Отмена заказа по инициативе клиента (кнопка «Назад» на экране ожидания). Без неё заказ завис бы в нетерминальном статусе. |

Вебхуки от Топаза (`adapters/primary/topaz/api/order/{accept,fueling,canceled,completed,volume}`) — не мобильные эндпоинты (Топаз стучится сам), но часть того же жизненного цикла заказа; в эту таблицу не включены, см. `topaz-server-credentials-and-known-bugs` в памяти.

## Остальные экраны — не разобраны

Balance, Coffee, Products, Profile, History, PayBalance, TransferBalance,
Bonuses/Promotions, News, JoinAccount, Settings, About*, Contacts, Help,
DeleteAccount и т.д. — эндпоинты добавятся сюда по мере прохода.

<!-- Следующие находки — добавлять сюда по мере прохода по остальным экранам. -->
