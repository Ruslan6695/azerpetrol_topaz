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

## Balance (QR-код клиента для кассы)

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET get_balance/` | `shared/common/api/userApi.ts` (через `useGetBalance`) | см. раздел Fuel выше | На этом экране баланс не отображается — запрос только обновляет `UserStore`, из которого живёт чип баланса в шапке приложения. |
| `GET refresh_token/` (косвенно) | `widgets/Home/HomeMainWidget/api/homeMainWidgetApi.ts` | `refresh_token/index.php` → `port_in_refresh_client_token($token)` → `core/clients/refresh_client_token.php` → `adapters/.../clients/update.php` | Сам QR не делает запрос — он рисует `UserStore.token`, который проставляется этим эндпоинтом при первом фокусе экрана Home за сессию (`isTokenRefreshed`). Токен генерируется как `sha1(phone . date('U'))` и ротируется в БД (`clients.token`/`clients.old_token`). **Найден и исправлен бэк-баг (2026-09-19, коммит `898aedd`)**: `update_client_token()` не проверял `rowCount()` — при гонке двух параллельных вызовов с одним и тем же старым токеном второй получал «успешно смененный» токен, которого на самом деле нет в БД (обрыв авторизации до повторного входа по SMS). Подтверждено изолированным SQL-тестом и живым curl на сервере. |

## Profile

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET profile/` | `proccesses/Profile/api/profileApi.ts` | `profile/index.php` → `port_in_mobile_profile($token)` → `core/mobile/mobile_profile.php::mobile_profile()` | Данные экрана: имя/телефон/баланс/бонусы/связанные аккаунты. `useFocusEffect` дёргает на каждый заход на вкладку «Профиль» и пишет `balance`/`bonus_balance` в `UserStore`. **Найден и исправлен бэк-баг (2026-09-19, коммит `689e59f`)**: третье по счёту место с тем же багом, что уже чинили в `/home/` и `/get_balance/` — `mobile_profile()` не подмешивал `bonus_balance`, реальный бонус затирался на `undefined` при каждом открытии «Профиля». Подтверждено живым curl (`74671.79` совпало с БД). |
| `GET profile/join_accounts/get_account_info/?phone=` | `features/AddJoinAccount/AddJoinAccountConfirm/api/addJoinAccountConfirmApi.ts` | `.../get_account_info/index.php` → `port_in_mobile_account_info($token,$phone)` | Поиск аккаунта по телефону перед добавлением в группу. |
| `GET profile/join_accounts/add/?id=` | `features/AddJoinAccount/AddJoinAccountConfirm/api/addJoinAccountConfirmApi.ts` | `.../add/index.php` → `port_in_mobile_balance_account_add($token,$id)` | Добавление найденного аккаунта в свою группу (доступно только создателю счёта — гейтится на фронте `balanceCreatorId === profileId`). |
| `GET profile/join_accounts/invite/` | `features/AddJoinAccount/ConfirmAddJoinAccountModal/api/confirmAddJoinAccountModalApi.ts` | `.../invite/index.php` → `port_in_mobile_account_get_invite($token)` | Получить свой инвайт-код для приглашения. |
| `GET profile/join_accounts/invite/confirm/` | тот же файл | `.../invite/confirm/index.php` → `port_in_mobile_account_invite_confirm($token)` | Подтвердить чужой инвайт (присоединиться к группе). |
| `GET profile/join_accounts/invite/abort/` | тот же файл | `.../invite/abort/index.php` → `port_in_mobile_account_invite_abort($token)` | Отменить свой инвайт-код. |
| `GET profile/join_accounts/delete/?accountId=` | `features/Profile/DeleteJoinAccountModal/api/deleteJoinAccountApi.ts` | `.../delete/index.php` → `port_in_mobile_balance_account_delete($token,$id)` | Создатель удаляет участника из своей группы. |
| `GET profile/join_accounts/leave/` | `features/Profile/LeaveFromProfileJoinAccounts/api/leaveFromProfileJoinAccountsApi.ts` | `.../leave/index.php` → `port_in_mobile_balance_account_exit($token)` | Участник (не создатель) сам покидает чужую группу. **Замечание**: на бэке рядом есть неиспользуемый дубль `.../exit/index.php` — тот же самый `port_in_mobile_balance_account_exit`, просто с другим форматом ответа; фронт всегда зовёт `leave/`, `exit/` — мёртвый код, не баг, но при следующей уборке бэка можно снести. |

`ExitFromProfile` (кнопка «Выйти») backend не вызывает — чисто локальный логаут через `UserStore.useLogout()`.

## Остальные экраны — не разобраны

Coffee, Products, History, PayBalance, TransferBalance,
Bonuses/Promotions, News, Settings, About*, Contacts, Help,
DeleteAccount и т.д. — эндпоинты добавятся сюда по мере прохода.

<!-- Следующие находки — добавлять сюда по мере прохода по остальным экранам. -->
