# Ревью экранов — карта эндпоинтов (фронт → бэк)

Растущий список: каждый раз, когда по ходу постраничного ревью
(`2026-09-18-screen-review-frontend-bugs-backlog.md`) встречается вызов
`axiosIntsanse`, он фиксируется здесь — что фронт вызывает, каким файлом,
что реально исполняется на бэке (`azerpetrol-topaz-server`, боевой) и что
это значит для пользователя. Обновляется по ходу разбора, экран за экраном.

## Полнота бэкенда: 45 из 46 вызываемых эндпоинтов структурно целы (2026-09-20)

Отдельно от построкового ревью прогнан полный структурный аудит: все 46
уникальных путей, которые реально вызывает `mobile-azerpetrol` (по всем
33 `api/*.ts` файлам), сверены с наличием файла в
`azerpetrol-topaz-server/public_html/adapters/primary/mobile_app/`, и
дополнительно — обходом `require_once` от всех точек входа проверено,
что вся цепочка зависимостей каждого файла тоже реально существует
(390 файлов в графе).

**Результат: только один эндпоинт сломан** — `profile/delete/confirm/`
требует несуществующий `ports/primary/mobile/mobile_account_delete_confirm.php`
(HTTP 500 на каждый вызов). Это единственный НЕДОПИСАННЫЙ бэкенд из всего,
что вызывает мобильное приложение — отложено по просьбе пользователя, см.
раздел «Известные бэкенд-баги, ОТЛОЖЕННЫЕ» в `2026-09-18-screen-review-frontend-bugs-backlog.md`.

**Важная оговорка**: «файл существует и подключается» ≠ «работает
корректно». Из 7 экранов, разобранных построчно на 2026-09-20 (Home,
Fuel, FuelLoading, Balance, Profile, История, PayBalance), нашлось и
исправлено 9 реальных багов — при том что все эти файлы уже существовали
и формально отвечали. Этот структурный аудит закрывает вопрос «что
недописано» — вопрос «что написано неправильно» закрывает только
построчный разбор экранов, и он ещё не завершён (Coffee, Products,
TransferBalance, Bonuses/Promotions, News, Settings, About, Contacts,
Help, DeleteAccount — файлы есть, корректность не проверена).

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
| `GET profile/` | `proccesses/Profile/api/profileApi.ts` | `profile/index.php` → `port_in_mobile_profile($token)` → `core/mobile/mobile_profile.php::mobile_profile()` | Данные экрана: имя/телефон/баланс/бонусы/связанные аккаунты. `useFocusEffect` дёргает на каждый заход на вкладку «Профиль» и пишет `balance`/`bonus_balance` в `UserStore`. **Найден и исправлен бэк-баг (2026-09-19, коммит `689e59f`)**: третье по счёту место с тем же багом, что уже чинили в `/home/` и `/get_balance/` — `mobile_profile()` не подмешивал `bonus_balance`, реальный бонус затирался на `undefined` при каждом открытии «Профиля». **Живой тест**: curl на реальном клиенте, `bonus_balance` в ответе (`74671.79`) совпало с БД. |
| `GET profile/join_accounts/get_account_info/?phone=` | `features/AddJoinAccount/AddJoinAccountConfirm/api/addJoinAccountConfirmApi.ts` | `.../get_account_info/index.php` → `port_in_mobile_account_info($token,$phone)` | Поиск аккаунта по телефону перед добавлением в группу; отказывает, если номер не найден, это ты сам, цель уже в чужой группе или уже получил приглашение от другого. **Живой тест**: два синтетических клиента A/B, поиск B по телефону с токена A вернул верные `id`/`name`. |
| `GET profile/join_accounts/add/?id=` | `features/AddJoinAccount/AddJoinAccountConfirm/api/addJoinAccountConfirmApi.ts` | `.../add/index.php` → `port_in_mobile_balance_account_add($token,$id)` → `mobile_balance_account_add()` | Создатель отправляет приглашение — создаёт строку в `mobile_account_invite`, не присоединяет сразу (нужно подтверждение с той стороны). Проверка `creator == вызывающий` есть **и на бэке**, не только на фронте. **Живой тест**: A приглашает B, `HTTP 200`. |
| `GET profile/join_accounts/invite/` | `features/AddJoinAccount/ConfirmAddJoinAccountModal/api/confirmAddJoinAccountModalApi.ts` | `.../invite/index.php` → `port_in_mobile_account_get_invite($token)` | Посмотреть своё входящее приглашение (кто позвал). **Живой тест**: B увидел приглашение от A с верным именем/телефоном. |
| `GET profile/join_accounts/invite/confirm/` | тот же файл | `.../invite/confirm/index.php` → `port_in_mobile_account_invite_confirm($token)` | Подтвердить приглашение — переносит `mobile_client_balance` подтверждающего на `balance_id` пригласившего, удаляет инвайт. **Живой тест**: после подтверждения B реально оказался в группе A (`SELECT` подтвердил общий `balance_id`), инвайт-строка удалена. |
| `GET profile/join_accounts/invite/abort/` | тот же файл | `.../invite/abort/index.php` → `port_in_mobile_account_invite_abort($token)` | Отклонить входящее приглашение, не вступая. **Живой тест**: B отклонил повторное приглашение от A — остался на своём балансе, инвайт-строка удалена. |
| `GET profile/join_accounts/delete/?id=` | `features/Profile/DeleteJoinAccountModal/api/deleteJoinAccountApi.ts` | `.../delete/index.php` → `port_in_mobile_balance_account_delete($token,$id)` → `mobile_balance_account_delete()` | Создатель удаляет участника из своей группы. **Найдены и исправлены 2 бэк-бага (2026-09-20, коммит `a022fbc`)**: (1) отсутствовала проверка «вызывающий — создатель» — любой рядовой участник группы мог выкинуть другого участника, кнопка была скрыта только на фронте; (2) `delete_client_balance()` не проверял `rowCount()` и врал про успех, даже если `id` не входил в группу вызывающего. **Живой тест на синтетической группе из 3 клиентов**: атака рядового участника → `HTTP 400`, состав группы не изменился; тот же запрос от создателя → `HTTP 200`, жертва реально переехала на свой отдельный баланс. |
| `GET profile/join_accounts/leave/` | `features/Profile/LeaveFromProfileJoinAccounts/api/leaveFromProfileJoinAccountsApi.ts` | `.../leave/index.php` → `port_in_mobile_balance_account_exit($token)` | Участник (не создатель) сам покидает чужую группу; создателя эта же функция не выпускает (`creator != my_id`). **Живой тест**: B сам вышел из группы A, вернулся на свой сольный баланс. **Замечание**: на бэке рядом есть неиспользуемый дубль `.../exit/index.php` — тот же самый `port_in_mobile_balance_account_exit`, просто с другим форматом ответа; фронт всегда зовёт `leave/`, `exit/` — мёртвый код, не баг, но при следующей уборке бэка можно снести. |

`ExitFromProfile` (кнопка «Выйти») backend не вызывает — чисто локальный логаут через `UserStore.useLogout()`, не тестировался отдельно (тривиальная логика).

Все 7 эндпоинтов join_accounts прогнаны живым end-to-end сценарием на синтетических тестовых клиентах (созданы и удалены на проде, реальных пользователей не касались): поиск → приглашение → просмотр инвайта → подтверждение → выход → повторное приглашение → отказ → (отдельно) попытка удаления не-создателем → удаление создателем.

## История

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET history/journal/?page=&date_start=&date_end=` | `widgets/HistoryWidget/api/historyWidgetApi.ts` | `history/journal/index.php` → `port_in_mobile_history_list(...)` → `mobile_history_list()` → `select_mobile_history()` | Список операций с пагинацией (по умолчанию 50/страница, без дат — текущий месяц). Правильно отдаёт `pages: null`, когда данных на одну страницу — фронт (`handleScrollToEnd`) корректно на этом останавливается. Есть хардкод спецкейса для одного конкретного `client_id=62762` (скрывает записи `'Начислены бонус%'`) — старый персональный костыль, не трогал. |
| `GET history/chart/?date_start=&date_end=` | `widgets/HistoryWidget/api/historyWidgetApi.ts` | `history/chart/index.php` → `port_in_mobile_history_chart(...)` → `mobile_history_chart()` → `select_mobile_history_chart()` | Суммы по типам операций для доната. Намеренно (или нет) исключает `type=1` целиком — см. находку в бэклоге фронтенд-багов. |
| `GET history/detail/?type=&id=` | `widgets/HistoryDetailsWidget/api/historyDetailsWidgetApi.ts` | `history/detail/index.php` → `port_in_mobile_history_detail(...)` → `mobile_history_detail()` | Детали одной записи. **Найдены и исправлены 2 бэк-бага (2026-09-20, коммит `a798527`)**: (1) IDOR — не проверялось владение записью, любой клиент читал чужие детали по `id`; (2) HTTP 500 на любом Топаз-наливе (`type=3`) — код искал `check_id` (UUID заказа Топаз) в легаси-таблице `cheks`, не находил и падал на делении на 0. Оба живо протестированы: IDOR — синтетическая чужая запись вернула `[]` после фикса вместо полных данных; краш — реальный налив (id=18, клиент 66809) вернул `HTTP 200` с верным `{name:"АИ-95", liters:2.51, price:95}` вместо `HTTP 500`. |

Между делом разгадан старый открытый вопрос из памяти `balance-history-clients-transactions-rewrite` (admin-панель, 2026-09-16): почему `mobile_history` пуст по переводам/бонусам, хотя код их пишет. Оказалось — не баг: `mobile_history` завели только с `2026-08-28` (переезд на этот сервер), а `clients_transactions` копит историю с 2023 года из старой системы; реальных переводов через ТЕКУЩЕЕ приложение с 28.08 почти не было. Живой тест перевода между двумя тестовыми клиентами подтвердил — код пишет в `mobile_history` корректно.

## PayBalance (пополнение через СБП)

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET balance_pay/?sum=` | `features/PayBalance/PayBalanceForm/api/payBalanceFormApi.ts` | `balance_pay/index.php` → `port_in_mobile_balance_pay(...)` → `mobile_balance_pay()` | Создаёт QR/ссылку СБП через внешний сервис ControlPay (`GET control-pay.ru/api/getQr`), сохраняет заявку в `control_pay` (`active=0`). |
| открытие `link` в `WebView`/банковском приложении | `features/PayBalance/PayBalanceSelectBank` | — | Не наш бэкенд — страница выбора банка от ControlPay/СБП, отдаёт диплинк банка через `postMessage`. |
| `GET balance/pay_success/?pay_id=` (поллинг раз в 1с) | `features/PayBalance/PayBalanceWaiting/api/payBalanceWaitingApi.ts` | `balance/pay_success/index.php` → `port_in_mobile_balance_pay_confirm(...)` → `mobile_balance_pay_confirm()` → читает `control_pay.active` | `pay_id` — это `control_pay.id` (внутренний PK, не `control_id` ControlPay). Раньше `active` никогда не становился `1` — см. ниже. |
| `POST` (внешний, не мобильный) `adapters/primary/control_pay/callback/` | — | `control_pay_callback()` | **Критический бэк-баг найден и исправлен (2026-09-20, коммит `74d904e`)**: вебхук подтверждения оплаты от ControlPay на этом сервере отсутствовал вовсе — перенесён со старого бэкенда (`local-test/azsdemo: api/control-pay/callback.php`), не перенесённого при миграции. Без него `control_pay.active` не выставлялся никогда — реальное пополнение зависало бы бесконечно на экране ожидания, деньги списаны банком, баланс не пополнен. Атомарный `claim` (`UPDATE ... WHERE active=0` + `rowCount()`) защищает от двойного зачисления при ретрае вебхука — в старом коде такой защиты не было. Подтверждено живым тестом полного цикла (создание → вебхук → баланс/история/транзакции → `pay_success/` → идемпотентность при повторе). **Нужно действие пользователя вне кода**: сверить/поменять URL колбэка в личном кабинете ControlPay на `.../adapters/primary/control_pay/callback/`. |

`balance/payment_return/` (возврат оплаты) — отдельный, НЕ мобильный путь: требует одновременно токен клиента И токен админ-сессии (`user_verification`, та же система, что у `azerpetrol-admin-panel`) — инициируется поддержкой/админкой, а не самим приложением. Заодно найден и исправлен соседний баг: `mobile_payment_return()` проверял несуществующий ключ `$res_balance['status']`.

## Coffee

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET coffee/get_list/?bonus=0\|1` | `widgets/Coffee/BuyCoffeeWidget/api`, `widgets/Coffee/CoffeeBonusWidget/api` | `coffee/get_list/index.php` → `mobile_coffee_list()` | Список товаров кофейни (`vendor_code != ''`, `bonus=1` дополнительно фильтрует `specification > 0`). Возвращает `bonus` (текущий счётчик бесплатных кофе клиента) и `balance`. **Найден и исправлен бэк-баг (2026-09-20, коммит `c7344b6`)**: каждому товару был жёстко зашит `discount: 10` (10%), никак не связанный с реальной ценой — фронт показывал несуществующую скидку. Теперь `discount: 0`, подтверждено живым curl. |
| `GET coffee/get_coffee_machines/` | `features/Coffee/SelectCoffeeMachine/api` | `coffee/get_coffee_machines/index.php` → `mobile_get_coffee_machines()` | Список кофемашин для выдачи (id/name/img). |
| `GET coffee/my_coffee_list/` | `widgets/Coffee/MyCoffeeWidget/api` | `coffee/my_coffee_list/index.php` → `mobile_coffee_my_list()` | Купленные-не-выданные напитки за 24ч (`client_coffee_list WHERE active=1 ORDER BY id DESC`) — самый новый первый, поэтому `coffee[0]` после покупки гарантированно и есть только что купленный кофе. Каждая строка несёт `qr` (код вендинг-протокола Franke) — именно тут клиент реально видит QR, не в ответе `buy/`. |
| `GET v2/coffee/buy/?bonus=&product_id=&coffee_machine_id=` | `features/Coffee/ConfirmCoffeePurchase/api` | `v2/coffee/buy/index.php` → `port_in_mobile_coffee_buy()` → `mobile_buy_coffee()` | Покупка/получение кофе. Ответ на успех — пустое тело (HTTP 200 без JSON), QR клиент получает отдельным запросом `coffee/my_coffee_list/`. **Найдены и исправлены 3 бэк-бага (2026-09-20, коммит `c1a8ed8`)**: (1) **критично** — `bonus=1` выдавал бесплатный кофе БЕЗ проверки `client_bonus_coffee.count`, любой клиент мог получить неограниченно бесплатного кофе (подтверждено: у реального клиента 224 накопленных бонуса — не теоретическая дыра); (2) платная покупка списывала 50% от розницы при пороге допуска 95% — по решению пользователя приведено к полной цене (акции — будущая фича); (3) `clients_transactions.balance` считался от неверной базы. Все три подтверждены живым curl+SQL циклом (отказ по балансу → отказ по бонусу → полная цена списана верно → бесплатный кофе списал счётчик 1→0, баланс не тронут). |

Начисление `client_bonus_coffee.count` (бонус «каждая заправка от 30 л») **физически не подключено** на этом сервере ни в одном виде — только старая кассовая интеграция (`local-test`) умела его начислять; сейчас работает только списание уже накопленного. `ScanCoffeeMachine` (сканирование QR на самой машине) — чисто локальная логика, без бэкенд-вызовов.

## TransferBalance

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET balance/get_client/?phone=` | `features/TransferBalance/TransferBalanceConfirm/api` | `balance/get_client/index.php` → `mobile_balance_transfer_get_client()` | Поиск получателя по телефону + возвращает баланс/бонус ОТПРАВИТЕЛЯ (не получателя — `port_out_mobile_balance($client_id)`, где `$client_id` это вызывающий, приватность получателя не утекает). Отклоняет перевод на телефон, привязанный к той же группе баланса (`balance_id` совпадает). **Найден и исправлен бэк-баг (2026-09-20, коммит `d59e781`)**: 4-й экземпляр уже привычного за сегодня бага — не отдавал `bonus_balance`. Подтверждено живым curl. |
| `GET balance/transfer/?receiver_id=&sum=` | тот же файл | `balance/transfer/index.php` → `mobile_balance_transfer()` | Сам перевод. **Найден и исправлен критический бэк-баг (2026-09-20, коммит `cc7877d`)**: `update_mobile_balance()` (общая функция списания, её же вызывают покупка кофе и старт налива) не гейтила достаточность баланса атомарно — два одновременных запроса от одного клиента могли оба списаться, уводя баланс в минус. Подтверждено дважды: SQL-симуляцией (100→-60 до фикса) и честным параллельным запуском двух реальных HTTP-переводов одновременно (`curl & curl & wait`) — после фикса один прошёл, один корректно отклонён, деньги не задвоились. Фикс — атомарный `UPDATE ... WHERE balance >= sum` в самой функции + проверка результата в 3 вызывающих местах (перевод/кофе/старт налива Топаз — для налива особый случай, см. коммит, откатить нельзя, т.к. Топаз уже принял заказ). |

## Bonuses/Promotions

| Вызов | Файл фронта | Бэкенд (`azerpetrol-topaz-server`) | Что делает |
|---|---|---|---|
| `GET promotions/` | `widgets/PromotionsAndBonusesWidget/api`, `features/Home/ShowMainPromotions/api`, `features/ShowPromotionsModal` (Home, дубль пути, уже отмечено в старом аудите 2026-09-02) | `promotions/index.php` → `mobile_promotions()` → `SELECT * FROM mobile_promotions WHERE active=1 LIMIT 50` | Единственный эндпоинт на весь раздел — список акций, главная-карусель Home и модалка при заходе используют его же, различие только в клиентской фильтрации по `show_main`/`show_modal`. Спецкейс для тестового аккаунта ревьюера (`phone==89000000000` → пустой список) — уже существовавший ранее осознанный паттерн, не новый. Багов не найдено. |

Экран деталей акции (`PromotionsAndBonusesDetailsScreen`) backend вообще не вызывает — все данные (заголовок/картинка/html_text/page_link) приходят route-параметрами из уже загруженного списка. Ветка `page_link` открывает внешнюю страницу во `WebView` с `?token=&theme=`.

## Остальные экраны — не разобраны

Products (пропущен по просьбе пользователя — там изменения в разработке),
News, Settings, About*, Contacts, Help,
DeleteAccount и т.д. — эндпоинты добавятся сюда по мере прохода.

<!-- Следующие находки — добавлять сюда по мере прохода по остальным экранам. -->
