# Передизайн сценария заправки под макет «21 Век»

## Зачем

Вкладка «Топливо» была последним крупным куском старой дизайн-системы: вокруг неё всё уже переделано (`(main)/_layout` с амбиентным фоном, `MainHeaderWidget`, `BottomMenu`), а сам сценарий налива жил на `BACKGROUND.Tertiary`, `displaySmall` и `CustomButton`.

Переделаны четыре шага:

| Шаг | Было | Стало (макет) |
|---|---|---|
| **Выберите метод** | три одинаковые карточки r16 + 6 локальных SVG с ветвлением по теме | герой «Выбрать колонку» r28 + ряд из двух плиток r22, иконки из `ICONS` (dc.html:151–177) |
| **Выбор АЗС** | `CustomSelect` с колесом-пикером | список стеклянных строк r20 (dc.html:496–509) |
| **Выбор колонки** | второй `CustomSelect` в той же форме | **отдельный шаг** с колесо-пикером в стеклянном поле — в макете такого экрана нет вообще |
| **Выбор топлива** | `TrkTypeBlock` на `BRAND.Primary`, r16, `displaySmall` | `FuelPriceRow` с бейджем марки и ценой `₽/л` (dc.html:511–524) |
| **Сумма и литры** | вертикальный «стакан» 130×280 + два `CustomInput` | сегмент «Литры/Сумма», карточка сумм, слайдер, чипы, сводка, карточка начислений, CTA-пилюля (dc.html:526–562) |

**Бэкенд не менялся.** Экран сканирования QR и ветка налива (`fuelLoading`) в объём не входили.

---

## Решения, принятые до кода

| Вопрос | Решение |
|---|---|
| Выбора номера колонки в макете нет ни на одном экране, но без `trk_id`/`nozzle_id` не стартует налив | Дорисован отдельный шаг. Сначала он был списком строк, но колонок на станции бывает под десяток и больше — список занимал весь экран. Итог: **колесо-пикер**, как в старом дизайне, в стеклянном поле нового |
| В макете шаги — push-экраны со стрелкой и заголовком в шапке, в коде — состояния `road` внутри одного роута | Автомат оставлен; вверху каждого шага появилась стеклянная «←» + заголовок (`entities/StepHeader`), нижние кнопки «Вернуться назад» убраны. Таб-бар остаётся виден |
| Горизонтального слайдера в проекте нет | Свой `shared/Slider` на `gesture-handler` + `reanimated` — обе библиотеки уже стоят, **пересборка dev-билда не нужна** |
| Бонусы, кэшбек и скидка — разные вещи, каждой нужен свой текст | Три независимых необязательных поля одного формата `TFuelModifier` + хелперы текста |
| Подсказки внизу экранов | Стеклянные `InfoCard` (в макете голый текст) — единообразно с Ценами и Балансом |

---

## Что сделано

### 1. Токены и общий кит — до вёрстки

| Файл | Изменение |
|---|---|
| [RADII.ts](../src/shared/common/config/constants/RADII.ts) | + `TILE: 22` — радиус плиток метода. Тот же паттерн будет на экране кофе |
| [TYPOGRAPHY_SCALE.ts](../src/shared/Typography/config/constants/TYPOGRAPHY_SCALE.ts) | + `num28` (800/28) — пассивная сторона карточки сумм (dc.html:541). Между `num20` и `h3`(30) в лестнице было пусто |
| [GlassCard.tsx](../src/shared/GlassCard/ui/GlassCard.tsx) | + проп `pressScale` (дефолт `PRESS_SCALE.CARD`): плиткам макета положен `TILE` 0.95, а масштаб был зашит жёстко. + вариант `bonus` — градиент `rgba(0,193,42,.22) → GLASS.Primary`, рамка лайм .24 (у `lime` другие стопы) |
| [ScreenTitle.tsx](../src/entities/ScreenTitle/ui/ScreenTitle.tsx) | + проп `type` (дефолт `h4`) — на экране топлива макет просит `h6`. Дефолт не тронут: компонент стоит в 8 виджетах |
| [Typography/index.ts](../src/shared/Typography/index.ts) | + реэкспорт `TTypographyTypes`, чтобы `ScreenTitle` не лез в `config/` мимо public API |
| [AmountField.tsx](../src/shared/AmountField/ui/AmountField.tsx) | + пропы `decimal` и `color` |

**`AmountField` в дробном режиме.** Поле держит собственный текст: при парсинге на каждое нажатие набранная точка («20.») тут же исчезала бы — значение возвращалось контролируемым `value`. Нижняя граница применяется на `onBlur`, иначе «0.5» при `min = 1` не набрать; верхняя — сразу, чтобы в запрос не ушло больше бака. Целочисленный режим (экраны пополнения и перевода) работает как раньше.

### 2. Контракт модификаторов: скидка ≠ кэшбек ≠ бонусы

Было одно поле `bonus`, которое на экране цен подписывалось «Кэшбек». Разведено на три независимых необязательных поля одного формата:

```ts
// shared/common/config/types/TFuelModifier.ts
export type TFuelModifier = {
    type: 'percent' | 'rubles'
    value: number
}

// shared/common/config/types/TFuelModifierKind.ts
export type TFuelModifierKind = 'discount' | 'cashback' | 'bonus'
```

- `discount` — скидка с цены, рисуется перечёркнутой старой ценой (как раньше);
- `cashback` — возврат деньгами;
- `bonus` — начисление баллами.

Тип переехал из `entities/Fuel/FuelPriceRow/config/types/` в `shared/common/config/types/`: он нужен и хелперу в `shared`, и `ITrkType`, а `shared` не имеет права импортировать из `entities`.

Новый хелпер [formatFuelModifier.ts](../src/shared/common/config/lib/helpers/formatFuelModifier.ts):

| Функция | Что делает |
|---|---|
| `formatFuelModifier(kind, modifier, unit)` | «Скидка 5%» / «Кэшбек 3 ₽» / «Бонусы 5%» — для строки списка |
| `collectFuelModifiers(source, kinds)` | собирает заполненные модификаторы в порядке показа |
| `calcFuelModifierAmount(modifier, sum)` | считает начисление от суммы заправки |
| `formatFuelModifierAmount(kind, modifier, sum)` | «Начислим 58 бонусов» / «Вернём 58 ₽ кэшбеком» — для карточки на экране литров |

Поля добавлены в `ITrkType` ([IFuel.ts](../src/shared/common/config/interfaces/IFuel.ts)), `IFuelPriceRow` и `IFuelPriceItem`. Все необязательные — **пока бэкенд их не отдаёт, строки просто не рендерятся**.

### 3. Новые слайсы

| Слайс | Что это |
|---|---|
| [shared/Slider](../src/shared/Slider/ui/Slider.tsx) | Горизонтальный слайдер: трек 6px `GLASS.Primary`, заливка и ручка `ACCENT.Lime`. Ширина трека держится и в JS (для отрисовки), и в `useSharedValue` (для жеста в UI-потоке). Значение квантуется шагом и клампится в одном месте — и жест, и внешние источники идут через него. Область касания — 22px, по 6px полоске попасть трудно |
| [entities/StepHeader](../src/entities/StepHeader/ui/StepHeader.tsx) | Круг 38 `Glass level="secondary"` с «←» + заголовок `num18`. От `InternalPagesHeader` отличается тем, что возврат приходит пропом: шаги живут в одном роуте, `router.back()` им не подходит |
| [entities/Fuel/FuelMainHero](../src/entities/Fuel/FuelMainHero/ui/FuelMainHero.tsx) | Герой «Выбрать колонку»: `GlassCard variant="hero"` r28, иконка 38, лаймовый круг-стрелка 40 справа по центру |
| [entities/Fuel/FuelMethodTile](../src/entities/Fuel/FuelMethodTile/ui/FuelMethodTile.tsx) | Плитка метода r22: иконка 28, `label14`, `caption11` |
| [entities/Fuel/FuelListRow](../src/entities/Fuel/FuelListRow/ui/FuelListRow.tsx) | Стеклянная строка списка r20 `16/18`: заголовок, подпись, значение справа |
| [shared/GlassSelect](../src/shared/GlassSelect/ui/GlassSelect.tsx) | Поле выбора нового дизайна: стеклянная строка с «⌄», по нажатию открывается существующий колесо-пикер `CustomSelectBottomSheet` (он же добавлен в public API `CustomSelect`). Пригодится и на экране кофе |

Строки принимают `id` и `onSelect(id)`, а не готовый `onPress`: иначе на каждый рендер списка создавалась бы новая стрелочная функция и `memo` строк не работал бы.

### 4. Экран «Выберите метод»

- [MapFuelMainBlocks.tsx](../src/features/Fuel/MapFuelMainBlocks/ui/MapFuelMainBlocks.tsx) — герой + ряд из двух плиток (`flex: 1` в обёртках: `GlassCard` сам по ширине не тянется). Порядок и тексты — по макету: «Выбрать колонку / Вручную из списка АЗС», «Сканировать QR / С колонки», «Нужна помощь / Подсказки, контакты».
- Удалены 6 SVG (`scanColumn`, `selectColumn`, `help` + их `*Dark`-двойники) и всё ветвление по `ThemeStore.useTheme()` — иконки набора «21 Век» нормализованы на `currentColor`.
- `entities/Fuel/FuelMainBlock` **не тронут**: его переиспользуют кнопки экрана кофе (`ScanCoffeeMachineButton`, `SelectCoffeeMachineButton`), а кофе не переделывается. Плитка поэтому — новый слайс.
- Подсказки — три `InfoCard`, тексты сохранены; исправлена латинская `C` в «Cканируйте QR-КОД».

### 5. Шаги «Выбор АЗС» и «Выбор колонки»

[SelectAzsAndColumn.tsx](../src/features/Fuel/SelectAzsAndColumnForm/ui/SelectAzsAndColumn.tsx) переписан: внутри слайса локальный `step: 'azs' | 'column'`, поэтому автомат `road` и пять виджетов не трогаются.

- Шаг «азс»: `StepHeader title="Выбор АЗС"` + список из `get_azs_list/`. **Адреса и расстояния в ответе нет** (`IAzs = { id, name }`) — подпись и «0.4 км» из макета не выдуманы; вместо этого АЗС, найденная по геолокации, помечается значением «Рядом с вами».
- Шаг «колонка»: `StepHeader title="Выбор колонки"` с возвратом на предыдущий шаг + новый `shared/GlassSelect` со списком из `get_trcs/` и кнопка «Перейти далее» (неактивна, пока колонка не выбрана). Скелетон на этом шаге показывает одну плашку, а не четыре.
- Состояния: переписанный `SelectAzsAndColumnSkeleton` (4 плашки высотой 52 с `RADII.ROW` — раньше три плашки по 60 без радиуса), `ErrorWhileFetchingForm` на ошибку, `CenteredState variant="empty"` на пустой список.
- Ушли: два `CustomSelect`, две `CustomButton`, `useSelect`, инлайновый `Skeleton` с глубоким импортом. `CustomSelect` остался в проекте — им пользуется кофе.
- В `GetLocationOfAzs` последняя `CustomButton` заменена на `PillButton variant="elevated"` — блок виден на этом же экране.

### 6. Шаг «Выберите топливо»

- [SelectTrkTypeForm.tsx](../src/features/Fuel/SelectTrkTypeForm/ui/SelectTrkTypeForm.tsx) — `StepHeader` + `ScreenTitle type="h6"` + список `FuelPriceRow` с `unit="₽/л"`. Файл заодно переформатирован под prettier проекта (был в двойных кавычках с точками с запятой).
- Новый [TrkTypeRow.tsx](../src/features/Fuel/SelectTrkTypeForm/ui/TrkTypeRow.tsx) — обёртка с `useCallback`, чтобы список не пересоздавал обработчики.
- Скелетон переписан под высоту строки цены (74 вместо 45), + `CenteredState` на пустой список.
- `entities/Fuel/TrkTypeBlock` удалён — потребителей не осталось.

### 7. Шаг «Сумма и литры»

[SelectLiters.tsx](../src/features/Fuel/SelectLiters/ui/SelectLiters.tsx) собран заново:

1. `StepHeader title="Сумма и литры"`;
2. сегмент «Литры / Сумма» — существующий `TabBarWithBackground` (его трек уже стеклянная пилюля с `padding: 4`);
3. карточка `GlassCard variant="glass2"` r28 `22/20`: активная сторона — `AmountField` в акцентной рамке, пассивная — вычисляемый текст (`h2` для литров, `num28` акцентом для суммы);
4. `Slider` от 1 до `FuelStore.tankVolume` с шагом 0.5 — вместо захардкоженного `MAX_LITERS = 60`;
5. чипы-пресеты 10 / 20 / 30 / «Полный бак» ([LitersPresets.tsx](../src/features/Fuel/SelectLiters/ui/LitersPresets.tsx)); «Полный бак» берёт объём из настроек пользователя, а не литерал 45 из макета; пресеты больше бака не показываются;
6. сводка — `ListGroup` + три `ListRow` (АЗС, «топливо · Колонка N», цена за литр) из `FuelStore.state`, а не литералы макета;
7. карточка начислений ([FuelBonusCard.tsx](../src/features/Fuel/SelectLiters/ui/FuelBonusCard.tsx)) — `GlassCard variant="bonus"` + `<Icon name="bonus" size={30} />` и по строке на каждый присутствующий модификатор. Нет модификаторов — карточки нет;
8. CTA — `PillButton title="Начать налив"`.

Состояние одно — литры; сумма из них вычисляется, а в режиме «Сумма» ввод в рублях пересчитывается обратно. **Проверка баланса и редирект на `ESCREENS.PAY_BALANCE` сохранены** без изменений.

Удалены оставшиеся без потребителей `SelectLitersForm` и `entities/Fuel/FuelLitersSelector` (вместе с мёртвым `FuelLitersSelectorLitersBlock`, статическим `COLORS` в модульном `StyleSheet` и ассетами `plus/minus/scroll.svg`).

### 8. Уборка

| Что | Где |
|---|---|
| Тип `road` вынесен в `TFuelRoad` вместо пяти дословных копий в пропсах виджетов | [TFuelRoad.ts](../src/shared/common/config/types/TFuelRoad.ts), процесс и 5 виджетов. Живёт в `shared`, потому что нужен и процессу, и виджетам, а импорт «снизу вверх» запрещён |
| `setRoad` вызывался **во время рендера**, а `useCallback` шли после условного `return` — порядок хуков нарушался | `FuelSelectTrkTypeWidget`, `FuelSelectLitersWidget` — перенесено в `useEffect` |
| Обработчики без `useCallback`, убивавшие `memo` дочерних | все четыре виджета шагов |
| `MapInfoBlocks` → `InfoCard`, константы перетипированы с `IInfoBlock` на `IInfoCard` | виджеты метода, АЗС, топлива, литров. `MapInfoBlocks` и `InfoBlock` не тронуты — у них ещё 4 потребителя (сканер, кофе, добавление счёта) |
| Неиспользуемый импорт `View` | `FuelScreen` |

---

## Расхождения с макетом и с бэкендом

**Дорисовано, потому что в макете нет:**
- шаг выбора колонки — макет обещает его подсказкой на первом экране («выберите нужную АЗС и номер колонки»), но экрана не рисует, а «Колонка 3» дальше везде литерал;
- состояния загрузки, пустого списка и ошибки на всех трёх шагах — в макете нет ни одного.

**Не перенесено, потому что нет данных:**
- адрес и расстояние в строке АЗС: `get_azs_list/` отдаёт только `{ id, name }`;
- в сводке на экране литров нет строки с адресом станции по той же причине.

**Ждёт бэкенда:** поля `discount` / `cashback` / `bonus` у марки топлива. Формат — `{ type: 'percent' | 'rubles', value }`; клиент считает начисление от суммы сам. Если поля назовут иначе, правка — в трёх интерфейсах.

**Осознанные отступления от макета:**
- заголовок героя на экране метода — `num18` (800/18) вместо 800/19: ради 1px новый тип в лестницу не заводился;
- подсказки — `InfoCard` вместо голого текста: единообразие с уже переделанными экранами;
- у выбранного чипа сохраняется рамка макета этого экрана только частично — `Chip` из кита рисует выбранный чип сплошным лаймом без рамки (вариант с экрана «Пополнение»);
- границы налива (мин. 1 л, шаг 0.5) заданы клиентом — в API их нет, в макете это литералы `<input min max step>`.

---

## Проверка

- `npx tsc --noEmit` — **17 ошибок до и 17 после**. Все базовые (`WheelPicker`, `CustomInput`, `CustomSelect`, `RangePicker`, `TabBar/index`, `FuelLoadingFuellingWidget`); новых нет. Указанные в `CLAUDE.md` «~39 ошибок» — устаревшая цифра.
- `npx prettier --check` — чисто по всем изменённым файлам. Два легаси-файла (`selectAzsAndColumnApi.ts`, `ISelectTrkTypeData.ts`) намеренно оставлены в прежнем формате, чтобы не раздувать диф.
- **На устройстве не проверялось** — нужен прогон дев-билда: полный путь метод → АЗС → колонка → топливо → литры, возврат «←» на каждом шаге, согласованность слайдера/чипов/полей, редирект на пополнение при нехватке средств, обе темы и Android (там `GlassCard` без блюра, а на экране литров работает `KeyboardAwareScrollView`).

## Что осталось в сценарии

Экран сканирования QR (`showScan`: тёмный вьюпорт r28, лаймовые уголки, лазер — оверлей делается один раз в `shared/CameraScanner`, но он общий с кофе) и вся ветка налива (`showFuelConfirm` → `showPouring` → `showFuelResult`: `CenteredState`, кольцо прогресса на `react-native-svg`, итоги через `ListRow`). Роут `fuelLoading` при этом лежит вне `(main)` и вне `InternalPagesLayout` — layout надо будет надеть на слое `screens`.
