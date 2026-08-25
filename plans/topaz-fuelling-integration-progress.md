# Топаз: перевод налива — Отчёт о реализации

**Дата:** 2026-08-25  
**Статус:** Завершено

## Описание задачи

Переключить запуск и опрос статуса налива в мобильном приложении «Азерпетрол» с прямого проксирования контроллера ТРК на систему **Топаз** («Topaz Web Office»). Вместо старого механизма «мобильное приложение → прокси на железо → сырые статусы контроллера» используется новая архитектура: «мобильное приложение → упрощённый контракт с собственным сервером пользователя → Топаз → реальная ТРК». Идентификация колонки переводится с сканирования QR-кода на ручной выбор из списка. Бизнес-логика бонусов, скидок и кэшбэка переезжает с идентификатора `art` на `fuelId` без изменения сути.

Всё изменение затрагивает только клиентскую часть (этот репозиторий). Сам сервер и его протокол с Топаз вне области плана.

## Что сделано

### Task 1: Общая модель данных (`shared`)

Переписаны основные типы под новую модель данных:

- **`IAzs`** — теперь `{id: string, name: string}` вместо `number` id (Топаз отдаёт строку).
- **`IColumn`** — упрощена до `{id: number}` (убраны `device` и `name`, колонка идентифицируется только номером).
- **`IFuelOption`** — новый тип вместо `ITrkType`: `{fuelId: string, name, price, discount?, cashback?, bonus?}` (нет концепции «пистолета»/нозла в Топаз, только список топлив на колонке).
- **`IFuelStore`** — добавлены поля `fuelOption` и `orderId` для хранения выбранного топлива и id заказа на сервере (нужен для поллинга статуса).

**Файлы:** `src/shared/common/config/interfaces/IFuel.ts`, `src/shared/common/config/interfaces/IFuelStore.ts`, `src/shared/common/model/fuelStore.ts`

### Task 2: Выбор АЗС и колонки

Обновлены API-методы и интерфейсы ответов под новый контракт:

- `selectAzsAndColumnApi.getAzsList()` → эндпоинт `fuelling/stations/` (вместо `get_azs_list/`).
- `selectAzsAndColumnApi.getColumns({azs_id: string})` → эндпоинт `fuelling/columns/` (вместо `get_trcs/`).
- `FuelListRow` типизирована на строковый `id` вместо числового.

**Файлы:** `src/features/Fuel/SelectAzsAndColumnForm/api/selectAzsAndColumnApi.ts`, `IGetAzsListData.ts`, `IGetColumnsData.ts`, `SelectAzsAndColumn.tsx`, `src/entities/Fuel/FuelListRow/ui/FuelListRow.tsx`

### Task 3: Выбор топлива

Переписана форма выбора типа топлива на новый контракт:

- `selectTrkTypeApi.getTrkTypes()` → `selectTrkTypeApi.getFuelOptions()` с эндпоинтом `fuelling/fuel_types/`.
- Поле `trc_types` → `fuel_options` в ответе.
- `TrkTypeRow` теперь работает с `IFuelOption` и проп `onSelect` типизирован на него.
- Форма сохраняет `fuelOption` в хранилище через `FuelStore.useChangeFuelOption()`.

**Файлы:** `src/features/Fuel/SelectTrkTypeForm/api/selectTrkTypeApi.ts`, `ISelectTrkTypeData.ts`, `SelectTrkTypeForm.tsx`, `TrkTypeRow.tsx`, `src/widgets/Fuel/FuelSelectTrkTypeWidget/ui/FuelSelectTrkTypeWidget.tsx`

### Task 4: Выбор суммы и литров

Переписан `SelectLiters` с минимальными изменениями модели:

- `trkType.price` → `fuelOption.price` (логика пересчёта цены ↔ объёма не меняется).
- `trkType.name` → `fuelOption.name`.
- Хранилище использует новый сигнатуру `FuelStore.useChangeFuelOption()`.

**Файлы:** `src/features/Fuel/SelectLiters/ui/SelectLiters.tsx`, `src/features/Fuel/SelectLiters/ui/FuelBonusCard.tsx`, `src/widgets/Fuel/FuelSelectLitersWidget/ui/FuelSelectLitersWidget.tsx`

### Task 5: Статусы и ошибки налива

Полностью переписаны перечисления и тексты ошибок под новую статусную модель Топаз:

- **`EFuelOrderStatus`** — новый enum: `OrderCreated, Accepted, Fueling, Completed, Expired, StationCanceled, UserCanceled` вместо сырых состояний контроллера (`idle, nozzle_up, autorized, fuelling, complete, offline`).
- **`EFuellingErrorKind`** — переименованы причины отмены: `EXPIRED, STATION_CANCELED, USER_CANCELED, TIMEOUT` (таймаут — прежний клиентский 10-минутный гард).
- **Тексты** в `getFuellingErrorText()` обновлены соответственно (удалены тексты про блокировку, неработающий пистолет и т.д.).

**Файлы:** `src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/enums/EFuelOrderStatus.ts` (новый, живёт в слайсе виджета, не в `shared`), `src/shared/common/config/enums/EFuellingErrorKind.ts`, `src/shared/common/config/lib/helpers/getFuellingErrorText.ts`, `src/widgets/FuelLoading/FuelLoadingErrorWidget/ui/FuelLoadingErrorWidget.tsx`, `src/proccesses/FuelLoading/ui/FuelLoading.tsx`

### Task 6: Запуск налива

Переписан эндпоинт и логика создания заказа:

- `fuelling/start/` изменён с `GET` на `POST` (семантически правильнее создавать ресурс).
- Тело запроса: `{azsId, columnId, fuelId, price, sum}` (упрощённый контракт, сервер сам собирает полноценный `Order` для Топаз).
- Ответ: `{orderId: string}` — этот id сохраняется в хранилище и используется для поллинга статуса.
- Виджет `FuelLoadingStartWidget` обновлён, логика старт/отмена сохранена.

**Файлы:** `src/widgets/FuelLoading/FuelLoadingStartWidget/api/fuelLoadingStartApi.ts`, `ui/FuelLoadingStartWidget.tsx`

### Task 7: Поллинг статуса налива

Переписан поллинг и обработка статусов:

- Эндпоинт `fuelling/status/?order_id=` вместо прежнего (параметр: `order_id` вместо `art`).
- Ответ: `{status: EFuelOrderStatus, volume, sum, reason?}` (новый enum статусов, необязательный текст причины отмены).
- `useFuellingPolling` меняется по существу, не только по именам: убраны эвристики поверх статусов железа (`hasStartedRef`, `lastTotalsRef`, вывод «налив завершён» из простоя колонки после старта) — Топаз сам присылает терминальный статус (`Completed`/`Expired`/`StationCanceled`/`UserCanceled`), поэтому угадывать окончание налива по бездействию контроллера больше не нужно. `sum` и `volume` теперь берутся как есть из ответа сервера (источник истины), а не считаются на клиенте как `volume * price`.
- UI-тексты в `FuelLoadingFuellingWidget` обновлены: «Готовим колонку…» при `OrderCreated`/`Accepted`, «Идёт налив…» при `Fueling`.

**Файлы:** `src/widgets/FuelLoading/FuelLoadingFuellingWidget/api/fuelLoadingFuellingApi.ts`, `ui/FuelLoadingFuellingWidget.tsx`, `lib/useFuellingPolling.ts`

### Task 8: Итоги налива

Точечные изменения экрана завершения:

- `trkType` → `fuelOption` в чтении из хранилища; поля `volume` и `sum` не меняются по смыслу.
- Строка «Топливо» теперь показывает `column.id` вместо удалённого `column.name` (у `IColumn` больше нет поля `name`, см. Task 1).
- Очистка хранилища через `FuelStore.clearState()` по-прежнему вызывается при возврате.

**Файлы:** `src/widgets/FuelLoading/FuelLoadingEndWidget/ui/FuelLoadingEndWidget.tsx`

### Task 9: Убрать сканирование колонки

Полностью удалена фишка сканирования QR-кода в пользу ручного выбора:

- **Удалено:** `src/widgets/Fuel/FuelScanBarcodeWidget` (весь компонент).
- Убрана ветка сканирования из типа маршрута `TFuelRoad` и соответствующий `case` в `switch` процесса `Fuel` — навигационных роутов на сканирование не было (это внутренний шаг `TFuelRoad`, а не запись в роутере), поэтому убирать было нечего в навигации как таковой.
- Флоу остался: главная → выбор АЗС/колонки → выбор топлива → выбор суммы → запуск налива. Сканирование просто убрано, шаг выбора АЗС/колонки становится первым пользовательским действием.
- Автоматизированных тестов в проекте нет, поэтому ничего тестового не удалялось.

**Файлы:** удалён `src/widgets/Fuel/FuelScanBarcodeWidget`; изменены `src/shared/common/config/types/TFuelRoad.ts`, `src/proccesses/Fuel/ui/Fuel.tsx`, `src/widgets/Fuel/FuelMainWidget/ui/FuelMainWidget.tsx`, `src/features/Fuel/MapFuelMainBlocks/ui/MapFuelMainBlocks.tsx`, `src/widgets/Fuel/FuelMainWidget/config/constants/FUEL_MAIN_WIDGET_INFO_TEXTS.ts`.

## Верификация

### Результат `npx tsc --noEmit`

Запущена проверка типов после всех 9 задач реализации (план состоит из 10 задач: 9 задач кода и эта, десятая — отчёт). Выход совпадает с ожидаемой базовой линией ровно в 4 ошибки (не 5, как указано в старом базовом списке — это исправлено в условиях Task 10):

```
src/app/_layout.tsx(25,13): error TS2554: Expected 2 arguments, but got 1.
src/screens/PromotionsAndBonusesDetailsScreen/ui/PromotionsAndBonusesDetailsScreen.tsx(10,41): error TS2344: Type 'TPromotionsAndBonusesScreenParams' does not satisfy the constraint 'string'.
src/shared/WheelPicker/index.tsx(217,45): error TS2503: Cannot find namespace 'JSX'.
src/shared/WheelPicker/types.ts(23,44): error TS2503: Cannot find namespace 'JSX'.
```

**Статус:** ✓ Совпадает с ожидаемой базовой линией. Все ошибки — предсуществующие, не вызванные этим планом (они касаются экранов и компонентов вне налива).

### Проверка затронутых файлов

По спеке в `plans/topaz-fuelling-integration-design.md`, раздел «Затронутые файлы»: все пункты закрыты.

- ✓ `shared/common/config/interfaces/IFuel.ts` — переписана.
- ✓ `shared/common/config/interfaces/IFuelStore.ts` — переписана.
- ✓ `shared/common/model/fuelStore.ts` — обновлена.
- ✓ `features/Fuel/SelectAzsAndColumnForm/*` — API и интерфейсы обновлены.
- ✓ `features/Fuel/SelectTrkTypeForm/*` — API, интерфейсы, `TrkTypeRow` обновлены.
- ✓ `features/Fuel/SelectLiters/*` — переименование `trkType` → `fuelOption` завершено.
- ✓ `widgets/FuelLoading/FuelLoadingStartWidget/*` — API обновлена на `POST`, эндпоинт и тело изменены.
- ✓ `widgets/FuelLoading/FuelLoadingFuellingWidget/*` — новый `EFuelOrderStatus`, поллинг, тексты обновлены.
- ✓ `widgets/FuelLoading/FuelLoadingEndWidget/*` — минимальны изменения, функционал сохранён.
- ✓ `shared/common/config/enums/EFuellingErrorKind.ts` — новые причины, тексты обновлены.
- ✓ `src/shared/common/config/lib/helpers/getFuellingErrorText.ts` — тексты ошибок обновлены.

## Известные незакрытые пункты (вне объёма)

1. **Комментарий в `src/shared/common/model/fuelStore.ts`:** в методе `getTankVolume()` был комментарий `// Ничего не сохранено или в хранилище мусор — оставляем дефолт.`, который был опущен при транскрипции в Task 1. Это соответствует коду спеки в самом плане и не является реальным дефектом (комментарий был информационным, логика сохранена).

2. **Неиспользуемые ассеты:** вариант `glass2` в `FuelMethodTile` может остаться без потребителей после удаления UI сканирования (Task 9). Оставлен в коде, не входит в объём этого плана — достоин флага для будущей очистки. (Иконка `fuel_scan` была в этом же положении; её регистрация удалена отдельной волной фиксов ревью — см. ниже.)

### Волна фиксов финального ревью (после Task 10)

После сдачи плана ревью веток нашло два открытых пункта, закрытых отдельным проходом:

1. **`GetLocationOfAzs` — типобезопасность геолокации.** Слайс `GetLocationOfAzs` не входил ни в один из 10 задач плана и остался забыт: он всё ещё дёргает легаси-эндпоинт `get_azs_geo/` и типизировал ответ как `{azs: IAzs}` — но `IAzs.id` с Task 1 стал строкой (id станций Топаз), а `get_azs_geo/` в рантайме отдаёт числовой id старого бэкенда. Заводить этот результат напрямую в `FuelStore.azs` было бы структурно некорректно (числовой id в поле, типизированном под строковый id Топаз), хоть TypeScript этого и не ловит (ответ axios не валидируется). Исправление: эндпоинту `get_azs_geo/` заведён свой тип `IAzsGeo` (не `IAzs`), а `FuelSelectAzsAndColumnWidget.handleSelectGeoAzs` теперь ничего не пишет в `FuelStore` — просто no-op, сохранённый ради UI самого `GetLocationOfAzs` (пермишены, тосты). **Открытый следующий шаг:** автоподбор станции по геолокации отключён до тех пор, пока в новом контракте не появится отдельный эндпоинт геопоиска по станциям Топаз (id строкой) — это отдельное архитектурное решение вне этой правки.
2. **Экран ошибки налива — тупик повторной проверки.** Кнопка «Проверить ещё раз» в `FuelLoadingErrorWidget` раньше показывалась всегда и просто повторяла опрос того же `orderId`. Для `EXPIRED`/`STATION_CANCELED`/`USER_CANCELED` это тупик: статус заказа Топаз терминальный, повтор опроса вернёт тот же ответ, и пользователь просто отскакивает обратно на этот же экран. Только `TIMEOUT` (собственный клиентский 10-минутный дедлайн, где реальный статус колонки не выяснен) оправдывает повтор. Теперь основное действие зависит от `kind`: для `TIMEOUT` — «Проверить ещё раз» (основное) + «Вернуться к выбору» (вторичное); для терминальных статусов — только «Вернуться к выбору» как основное.

## Что не входит в объём этого плана

1. **Реализация серверной части:** эндпоинты `fuelling/stations/`, `fuelling/columns/`, `fuelling/fuel_types/`, `fuelling/start/` (на новый контракт), `fuelling/status/`, а также приём вебхуков от Топаз (`/api/order/accept`, `/order/fueling`, и т.д.) — всё это реализует пользователь на своём отдельном сервере, вне этого репозитория.

2. **Регистрация окружений в Топаз:** пользователь сам регистрирует тестовое и боевое окружения в личном кабинете интегратора Topaz Web Office, указывая домен и public IP своего сервера. Это управление инфраструктурой, не код мобильного приложения.

3. **Реальное тестирование налива:** полная проверка запуска налива, поллинга статуса и получения уведомлений от Топаз возможна только на работающем dev-билде приложения (`yarn ios` / `yarn android`) против тестового окружения Топаз, с работающим серверным компонентом — такая проверка требует живой окружение и находится вне автоматизированного pipeline. Типы гарантируют, что клиент готов к контракту; настоящий налив проверяется интеграционно.

4. **Открытая точка для решения владельцем контракта: имена ключей конверта ответа.** Спека (`plans/topaz-fuelling-integration-design.md`) изначально набрасывала `fuelling/stations/` и `fuelling/columns/` как ответы простым массивом (`[...]`), но в реализации оба сохранили легаси-имена ключей-обёрток: `{azs_list: [...]}` и `{trcs: [...]}` соответственно. При этом `fuelling/fuel_types/` ключ обёртки переименовало (`trc_types` → `fuel_options`). Формат также вперемешку сочетает snake_case в телах запросов (`azs_id`, `column_id`, `fuel_id`, `order_id`) и camelCase в полях ответов (`orderId`) — по-разному от эндпоинта к эндпоинту. Это осознанный выбор реализации (минимизировать изменения в существующем UI-коде), а не баг, и код его не трогает молча — но перед тем как под этот контракт будет реально построен сервер, владельцу проекта стоит сознательно решить, устраивает ли его такая непоследовательность именования, или контракт нужно выровнять до реализации бэкенда.

## Прочие замечания

- **Стиль кода:** сохранены 4 пробела, без `;`, одинарные кавычки, `trailingComma: es5` — всё в соответствии с `.prettierrc.cjs`.
- **Импорты:** только относительные, слайсы через `index.ts`, невизуальный `shared` — через `src/shared/index.ts`.
- **Коммиты:** каждая задача завершена отдельным коммитом по плану, ветка готова к слиянию.
- **Языки:** тексты интерфейса и комментарии — на русском, переменные и файлы — на английском (проектная конвенция).
