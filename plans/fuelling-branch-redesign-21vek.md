# Ветка налива под макет «21 Век»: запуск → налив → итоги

## Зачем

Продолжение [fuel-flow-redesign-21vek.md](fuel-flow-redesign-21vek.md). Тот отчёт закрыл выбор
АЗС, колонки, топлива и литров, а последней строкой зафиксировал остаток: «вся ветка налива
(`showFuelConfirm` → `showPouring` → `showFuelResult`)». Здесь она и переделана.

Три экрана живут на роуте `/fuelLoading` состояниями одного локального автомата. До правок они
целиком были в старой дизайн-системе: `CustomButton`, `WarningImage`/`SuccessImage`,
`BackgroundImage`, `displayLarge/Medium/Small`, `COLORS.BACKGROUND.Tertiary`. Роут при этом лежит
вне `(main)` и **вообще без layout** — ни амбиентного фона, ни общего скролла.

Кроме вёрстки починены три поведенческих дефекта, которые были видны в коде:

1. **Ошибки налива не показывались.** На статусах `error`/`locked` виджет вызывал
   `setErrorText(...)`, но `AnimateFuelLoading` этот текст не принимал — экран просто зависал на
   «идёт налив», а интервал продолжал тикать. `halted` и `idle` не разбирались вообще.
2. **Поллинг без защиты от гонки и без дедлайна** — `setInterval` 1 с без флага `inFlight`, с
   пустыми зависимостями `useEffect` при чтении `state.azs`/`state.column` внутри.
3. **`clearState()` не чистил `trkType` и `rubles`** и **не вызывался ни разу за всё приложение** —
   следующая заправка стартовала на хвостах предыдущей.

Макет: [21vek-app.dc.html](../design/21vek-app.dc.html) строки **564–599**. В `DESIGN_SPEC.md`
номера строк именно для этих трёх экранов устарели на −6.

---

## Решения, принятые до кода

| Вопрос | Решение |
|---|---|
| Оставлять ли `/fuelLoading` отдельным роутом или свести шаги в автомат `road` вкладки «Топливо», как в прототипе | **Оставлен отдельный роут.** Налив нельзя прерывать переключением вкладок, а таб-бар и шапка с балансом на этих экранах лишние. Правится только вёрстка трёх шагов, навигация не трогается |
| Что показывать на `error` / `locked` / `halted` | **Полноценный экран ошибки** на `error`/`locked`/таймаут; `halted` и `idle` — подписью под кольцом. Разбор статусов был в объёме, потому что без него ошибка не доходит до пользователя вообще |
| Состав строк в итогах: 4 из макета или 3 из старого кода | **4 из макета + «Остаток на балансе»**: данные уже есть, а пользователю остаток важнее адреса станции |
| Где взять кольцо прогресса | Свой `shared/ProgressRing` на `react-native-svg` + `reanimated` — обе библиотеки уже стоят, **пересборка дев-билда не нужна**. `CustomPieChart` (gifted-charts) не подходит: нужна дуга со скруглёнными концами и живой анимацией |
| Переименовывать ли слайсы под словарь макета (`Confirm`/`Pouring`/`Result`) | **Нет.** `FuelLoadingStartWidget` / `FuelLoadingFuellingWidget` / `FuelLoadingEndWidget` и значения `road` оставлены — переименование дало бы только шум в дифе |

---

## Что сделано

### 1. Токены и общий кит — до вёрстки

| Файл | Изменение |
|---|---|
| **[shared/ProgressRing](../src/shared/ProgressRing/ui/ProgressRing.tsx)** (новый) | Кольцо 150 из макета: фоновая дуга `GLASS.Secondary`, поверх лаймовая со скруглёнными концами, старт с 12 часов. Пропы `progress` (0…1), `size`, `strokeWidth`, `trackColor`, `progressColor`, `duration`, `children` |
| [ListRow.tsx](../src/shared/ListRow/ui/ListRow.tsx) | + проп `valueAccent` → значение рисуется `num16` цветом `ACCENT.Primary` (строка «Списано», dc.html:595). Дефолт не тронут: `ListRow` уже стоит в сводке на «Сумма и литры» и в профиле |
| [StepHeader.tsx](../src/entities/StepHeader/ui/StepHeader.tsx) | `onBack` стал необязательным — без него круг «←» не рисуется. Плюс `minHeight` на контейнере, чтобы контент не прыгал между шагами одного роута |
| `shared/common/config/types/TFuelLoadingRoad.ts` | `'start' \| 'fuelling' \| 'end' \| 'error'` вместо литерала, продублированного в трёх файлах (приём из `TFuelRoad`) |
| `shared/common/config/interfaces/IFuellingTotals.ts` | `{ volume, sum }` — итоги налива. В `shared`, потому что нужны и процессу, и двум виджетам |
| `shared/common/config/enums/EFuellingErrorKind.ts` | `PUMP_ERROR \| LOCKED \| TIMEOUT` |
| `shared/common/config/lib/helpers/getFuellingErrorText.ts` | Заголовок и описание по kind — вместо сравнений со статусами по месту (auth.md, правило 5) |
| [fuelStore.ts](../src/shared/common/model/fuelStore.ts) | `clearState()` дочищает `trkType` и `rubles` |

Всё новое из `shared/common/` дописано в [shared/index.ts](../src/shared/index.ts).

**Про длину окружности.** В макете `stroke-dasharray` задан литералом `402` (это `2π·64`). В коде
радиус домножается на `SIZES.PX`, поэтому длина считается как `2 * Math.PI * r` от фактического
бокса — иначе дуга разъезжается на других плотностях экрана.

**Про анимацию.** Прототип пересчитывает `pourLiters` через `setState` каждые 40 мс. В RN это
перерисовывало бы весь экран на каждый тик, поэтому анимируется `strokeDashoffset` через
`useAnimatedProps` — значение живёт в UI-потоке, `strokeDasharray` задан один раз.

### 2. Layout на слое `screens`

[FuelLoadingScreen.tsx](../src/screens/FuelLoadingScreen/ui/FuelLoadingScreen.tsx) надевает
`InternalPagesLayout hideHeader` — оттуда приходят `AmbientBackground`, `KeyboardAwareScrollView`,
`paddingHorizontal: 20` и `CheckNetworkWidget` на офлайне. Заголовок даёт `StepHeader` внутри шага,
а не `InternalPagesHeader`: у трёх состояний одного роута заголовки разные.

Из-за `hideHeader` верхний инсет пришлось дать самим: `/fuelLoading` лежит вне группы `(main)`,
`SafeAreaView` его не оборачивает, а компенсировал вырез именно хедер. Виджеты после этого
перестали рисовать свой фон, паддинги и `BackgroundImage`.

### 3. Процесс

[FuelLoading.tsx](../src/proccesses/FuelLoading/ui/FuelLoading.tsx) — автомат на четыре ветки:
`road`, `totals` и `errorKind`. Итоги кладутся из ответа колонки (`volume` × `price`), а не
пересчитываются по `trkType.price`, как раньше: фактический объём — источник истины бэкенда.

Возврат из ошибки на поллинг (`handleRetry`) заново `fuelling/start/` **не дёргает** — сессия на
бэкенде уже открыта, колонка могла просто ожить.

### 4. Шаг «Запуск налива» (dc.html:564–572)

[FuelLoadingStartWidget.tsx](../src/widgets/FuelLoading/FuelLoadingStartWidget/ui/FuelLoadingStartWidget.tsx)
целиком лёг на существующий `shared/CenteredState`: круг 96 с `<Icon name="tab_fuel" size={44} />`,
`h5`-заголовок «Готовы начать налив?», сводка `АЗС · Колонка · Топливо · N л на M ₽` и пара кнопок
«Запустить колонку» (лайм, с лоадером) / «Отмена».

- Восемь `//@ts-ignore` в `handleStartFuelling` убраны гардом по `FuelStore` до вызова.
- `hideToastOnError: true` снят — ошибку старта показывает общий тост `useSendFetch`; отдельного слота под текст в макете нет.
- «Отмена» и «←» ведут `router.back()` на «Сумма и литры»: `fuelling/start/` к этому моменту ещё не звучал, отменять на бэкенде нечего.

### 5. Шаг «Идёт налив» (dc.html:574–583)

**Поллинг переехал в
[useFuellingPolling.ts](../src/widgets/FuelLoading/FuelLoadingFuellingWidget/lib/useFuellingPolling.ts)**
по образцу `useCallcheckPolling` (auth.md, правило 3): интервал 1 с, флаг `inFlight` против
параллельных запросов, гашение интервала на терминальном статусе, cleanup на размонтировании,
дедлайн 10 минут, флаг `enabled`. Запрос идёт через `useFetchData`, поэтому **разлогин по 401
остаётся централизованным** — своей обработки 401 в хуке нет.

Разбор статусов:

| Статус | Поведение |
|---|---|
| `fuelling` | «Идёт налив…» |
| `idle` | «Ожидаем колонку…», кольцо на нуле |
| `halted` | «Налив приостановлен» цветом `STATE.Destructive`, поллинг продолжается |
| `complete` | итоги → шаг `end` |
| `error` | шаг `error`, kind `PUMP_ERROR` |
| `locked` | шаг `error`, kind `LOCKED` |
| дедлайн | шаг `error`, kind `TIMEOUT` |
| нет ответа сети | молча ждём следующий тик — тост на каждый неудачный опрос завалил бы экран |

Вёрстка — новый
[entities/FuelLoading/FuelPouringProgress](../src/entities/FuelLoading/FuelPouringProgress/ui/FuelPouringProgress.tsx):
кольцо с `h3`-литрами и `caption11` «из N л» в центре, под ним `num20` статус и `body13` строка
«Колонка N · топливо · не отходите от авто».

`StepHeader` здесь **без** `onBack`, аппаратная кнопка «назад» гасится `BackHandler`, а свайп-возврат
отключён для всего роута (`gestureEnabled: false` в [_layout.tsx](../src/app/_layout.tsx)) —
сессия на колонке уже открыта, вернуться в неё приложению неоткуда.

Заодно исправлен тип `columnDevice` в `fuelLoadingFuellingApi`: был объявлен `number`, а
`IColumn.device` — строка. Аргументы вынесены в `IFuelLoadingFuellingArgs`, ответ типизирован
дженериком `axiosIntsanse.get<IFuelLoadingFuellingData>`.

### 6. Шаг «Итоги налива» (dc.html:585–599)

[FuelLoadingEndWidget.tsx](../src/widgets/FuelLoading/FuelLoadingEndWidget/ui/FuelLoadingEndWidget.tsx) —
не центрированный экран, а обычная колонка:

1. [FuelLoadingResultHeader](../src/entities/FuelLoading/FuelLoadingResultHeader/ui/FuelLoadingResultHeader.tsx) — лаймовый круг 72 с «✓» и `h6` «Налив завершён». `CenteredState` сюда не подошёл: он центрируется по `flex` на весь экран;
2. `ListGroup level="secondary"` + пять `ListRow`: АЗС, «топливо · Колонка N», литры, «Списано» с `valueAccent`, «Остаток на балансе»;
3. `PillButton variant="elevated"` «На главную» → `clearState()` + `ESCREENS.HOME`.

Баланс перезапрашивается при монтировании итогов: в сторе он остался догрузочным — списание
произошло уже после того, как процесс подтянул баланс на фокусе.

### 7. Экран ошибки — сверх макета

[FuelLoadingErrorWidget.tsx](../src/widgets/FuelLoading/FuelLoadingErrorWidget/ui/FuelLoadingErrorWidget.tsx):
`CenteredState variant="error"` с текстом по `errorKind` и кнопками «Проверить ещё раз» /
«Вернуться к выбору». Сделан виджетом, а не entity, — по образцу `SuccessWidget`: entity не ходит
в роутер.

### 8. Уборка

Удалены слайсы, у которых после правок не осталось ни одного потребителя во всём `src/`:

| Слайс | Почему |
|---|---|
| `features/FuelLoading/AnimateFuelLoading` | три вращающихся круга-волны заменены кольцом |
| `entities/FuelLoading/FuelLoadingFuellingTotals` | плашки «Литры / Сумма» в макете нет, число живёт в центре кольца |
| `entities/FuelLoading/FuelLoadingEndInfoItem` | заменён на `ListGroup`/`ListRow` |
| `shared/WarningImage`, `shared/SuccessImage`, `shared/BackgroundImage` | их единственными потребителями были эти три экрана |

Комментарий в `AmbientBackground`, ссылавшийся на `BackgroundImage`, поправлен. Убран `//@ts-ignore`
из бочонка `FuelLoadingEndWidget`.

---

## Расхождения с макетом и с бэкендом

**Дорисовано, потому что в макете нет:**
- экран ошибки налива и состояния `idle`/`halted` — в прототипе налив длится 2400 мс и всегда доходит до 100%;
- лоадер на «Запустить колонку»: в макете переход мгновенный, запроса к колонке не нарисовано;
- строка «Остаток на балансе» в итогах.

**Не перенесено, потому что нет данных:** адрес АЗС в итогах — `get_azs_list/` отдаёт только
`{ id, name }`, поэтому строка короче макетной «№14 — Садовая, 8».

**Осознанные отступления от макета:**
- кнопки `CenteredState` идут по ширине контента, а не фиксированными 240 — так уже сделано на экране «Успешно»;
- высота главной кнопки 54 (`PillButton size="lg"`) вместо 56: ради 2px новый размер в `SIZE_MAP` не заводился;
- на «Идёт налив» и «Итоги» нет кнопки «←» — макет её рисует на всех push-экранах, но возвращаться оттуда некуда;
- заголовок подтверждения — `h5` из `CenteredState` вместо 800/22 (`h6`): ради этого компонент не параметризовался.

**Ждёт бэкенда:** ответ `fuelling/start/` по-прежнему не типизирован — он не используется, id сессии
налива клиенту не возвращается. Если появится, туда же ляжет отмена налива, которой сейчас нет ни в
API, ни в макете.

**Бонусов на экране итогов нет** — в макете начисление показано только на «Сумма и литры». Если
понадобятся, блок берётся из готового `features/Fuel/SelectLiters/ui/FuelBonusCard.tsx`.

---

## Проверка

- `npx tsc --noEmit` — **17 ошибок до, 16 после**. Ушла ошибка в `FuelLoadingFuellingWidget`, новых не добавилось; оставшиеся 16 базовые (`WheelPicker`, `CustomInput`, `CustomSelect`, `RangePicker`, `TabBar/index`, `CustomButton`, `_layout`, `PromotionsAndBonusesDetailsScreen`). Указанные в `CLAUDE.md` «~39 ошибок» — устаревшая цифра.
- `npx prettier --check` — чисто по всем изменённым файлам. `FuelLoadingEndWidget.tsx` заодно переписан из двойных кавычек с точками с запятой под конфиг проекта.
- Тестов и линтера в проекте нет — заявлять, что тесты прошли, нельзя.
- **На устройстве не проверялось.** Нужен прогон дев-билда (в Expo Go не запустится): «Сумма и литры» → «Запустить колонку» → кольцо растёт по данным `fuelling/status/` → итоги → «На главную», после чего повторный вход в заправку начинается с чистого `FuelStore`. Отдельно: «Отмена» на подтверждении, обрыв сети во время поллинга, статусы `locked`/`error` (нужен стенд или подмена ответа), аппаратный «назад» и свайп во время налива, **обе темы** и Android без блюра.
- Новых нативных модулей нет — `react-native-svg`, `reanimated`, `gesture-handler` уже стоят, **пересборка дев-билда не требуется**.

## Что осталось в сценарии заправки

Экран сканирования QR (`showScan`: тёмный вьюпорт r28, лаймовые уголки, лазер) — оверлей делается
один раз в `shared/CameraScanner`, но он общий с кофе.
