# Дочистка остатков старой дизайн-системы

Заключительная волна редизайна под макет «21 Век». Предыдущие заходы переделали экраны;
здесь снято всё, что от старой дизайн-системы оставалось между ними.

## Зачем

Аудит всех цепочек `screens → proccesses → widgets → features → entities` показал, что
25 из 27 экранов уже на новом ките, а старое держится в считанных точках — но эти точки
**сквозные**:

- `ErrorWhileFetchingForm` рисовал состояние ошибки на **16** экранах;
- `CheckNetworkWidget` — оффлайн-вид **всех** внутренних экранов (он подставляется вместо
  содержимого в обоих лэйаутах);
- из-за них не могли умереть `CustomButton`, `ErrorGif`, `MPLayout` и старая половина
  шрифтовой лестницы.

То есть дело было не в количестве экранов, а в том, что несколько общих компонентов
протаскивали старый вид по всему приложению.

**Бэкенд не менялся** ни в одном месте.

---

## Три факта, на которых построен порядок работ

Их установил аудит до первой правки — они сделали token-часть механической:

1. **`<Typography>` без `type=` — ровно 8 штук**, и все 8 в файлах, которые в этой же
   работе переписывались или удалялись. Значит дефолт `bodySmall` можно снести, но
   **только последним шагом**.
2. **`COLORS.Icon.*` использовался в 12 местах и только в вариантах `Primary`/`Secondary`/`Invert`**,
   а их значения побайтово совпадали с `TEXT.Primary`/`.Secondary`/`.Invert` в обеих палитрах.
   Замена не меняет ни одного пикселя.
3. **`COLORS.BRAND/SUCCESS/ERROR` вне `COLORS.ts` жили в одном файле** — `CustomButton`,
   который всё равно шёл под удаление.

---

## Что сделано

### 1. Состояния ошибки, оффлайн, сканер

| Файл | Было | Стало |
|---|---|---|
| [ErrorWhileFetchingForm.tsx](../src/entities/ErrorWhileFetchingForm/ui/ErrorWhileFetchingForm.tsx) | `ErrorGif` + `CustomButton` + `Typography` без типа + ручные маргины | `CenteredState variant="error"` |
| [CheckNetworkWidget.tsx](../src/widgets/CheckNetworkWidget/ui/CheckNetworkWidget.tsx) | `wifi.svg` + `type="caption"` + `SIZES.HEIGHT(0.6)` | `CenteredState variant="error"` |
| [FuelScanBarcodeWidget.tsx](../src/widgets/Fuel/FuelScanBarcodeWidget/ui/FuelScanBarcodeWidget.tsx) | заголовок `bodyAccentMedium`, кадр камеры вручную, `CustomButton` «Вернуться назад», `MapInfoBlocks` | `StepHeader` + `CameraScanner` + `InfoCard` |
| [WithoutPromotionsAndBonusesBlock.tsx](../src/entities/PromotionsAndBonuses/WithoutPromotionsAndBonusesBlock/ui/WithoutPromotionsAndBonusesBlock.tsx) | гифка `NewsGif` | `CenteredState variant="empty"` |
| [DevelopmentInProgressWidget.tsx](../src/widgets/DevelopmentInProgressWidget/ui/DevelopmentInProgressWidget.tsx) | лотти + капсовый текст | `CenteredState variant="empty"` |

**Сигнатура `ErrorWhileFetchingForm` изменилась.** Пропы `margins` и `buttonProps` убраны:
геометрию целиком держит `CenteredState`, а раньше каждое из 14 мест вызова подгоняло форму
своими отступами (`mt: 100`, `mb: 55`, `mt: 40`). Вместо `buttonProps` появились `buttonText`
и `buttonVariant` — они нужны ровно одному вызову, запросу доступа к камере
(«Разрешить», лаймовая кнопка).

`FuelScanBarcodeWidget` был **единственным целиком непеределанным экраном**. Собран не с нуля,
а по образцу уже готового [ScanCoffeeMachineWidget](../src/widgets/Coffee/ScanCoffeeMachineWidget/ui/ScanCoffeeMachineWidget.tsx) —
в макете это один и тот же шаг сканирования (`showScan`, dc.html 474–488). Оверлей с лаймовыми
уголками и бегущим лазером уже жил в `shared/CameraScanner`, ручные `SIZES.WIDTH(0.8)`/`HEIGHT(0.4)`
оказались лишними: у кадра есть собственная геометрия. Константа подсказок сменила тип
`IInfoBlock[]` → `IInfoCard[]` — формы идентичны (`{ title, info }`), правка одной строки импорта.

Ассет `wifi.svg` удалён: он был захардкожен на `#4C5159` (`.svgrrc` подменяет только `#000`),
то есть не тонировался темой в принципе. Замены в новом реестре иконок нет, а у состояния
ошибки в макете круг с «!» — его и даёт `CenteredState`.

### 2. Модалки и нажатия

**`CustomModal` оказался не легаси-компонентом.** На нём стоит в том числе новый
`shared/ConfirmDialog` — это общая оболочка модалок, а не остаток старой системы. Поэтому
приведён в порядок, а не удалён:

- заголовок `num18` вместо `bodyAccentSmall`;
- радиус по умолчанию `RADII.HERO_SM` (28 по макету) вместо 15;
- ряд заголовка на `space-between` вместо костыля `marginsPaddings={{ mr: 30 }}`;
- `padding` через `SPACING.SCREEN`;
- мёртвый проп `white` убран вместе с его единственной передачей в `QrCodeModal`.

[ConvertBonusModal](../src/features/Home/ConvertBonusToBalance/ui/ConvertBonusModal.tsx):
собственный `TextInput` с `fontSize: 30` → `AmountField`, ручные «пресеты» → `Chip`,
`borderRadius: 32` → `RADII.PILL`. Ручное зажатие ввода в `[0, max]` удалено — это делает
`AmountField` через проп `max`.

[CustomSelectBottomSheet](../src/shared/CustomSelect/ui/CustomSelectBottomSheet.tsx) (живёт под
`GlassSelect`): две кнопки `CustomButton` → `PillButton`, `num16` вместо `bodyAccentMedium`,
бэкдроп на `EFFECTS.Backdrop` вместо хардкода `rgba(0,0,0,0.49)`, радиус шита на `RADII.SHEET`.
**После этой правки у `CustomButton` не осталось ни одного потребителя.**

`CustomTouchableOpacity` вытеснен `PressableScale` в `OpenUseTerms`, `QrCode` и `BottomSheet`.
Там, где отклика быть не должно (бэкдропы, перехват тапа мимо карточки), взят `scaleTo={1}` —
обёртка нужна ради `dismissKeyboard`, который был у `CustomTouchableOpacity` по умолчанию.

### 3. Удаление мёртвого кода

Сначала вынесены два **живых** хука, которые держали легаси-модули:

- `useInput` переехал из `shared/CustomInput` в `shared/common/config/lib/hooks/` и
  реэкспортирован из бочонка `shared`. Пять потребителей: вход, регистрация, код из
  SMS/звонка, приглашение пользователя.
- `useTabBar` переносить **не понадобилось**: у `TabBarWithBackground` уже был свой такой же
  хук, а `ITab` и `ITabWithBackground` совпадают по форме. `proccesses/Coffee` переключён на
  него — он и так рендерил `TabBarWithBackground`, а хук брал из старого слайса.

Удалены слайсы без единой ссылки:

`BackIcon`, `LocationIcon`, `PhoneIcon`, `SumIcon`, `WalletIcon`, `DisabledIcon`,
`CustomInput`, `CustomButton`, `CustomTouchableOpacity`, `ErrorGif`, `NewsGif`,
`DevelopmentInProgressGif`, `TabBar`, `entities/TransferBalanceConfirmInfoItem`,
`entities/InfoBlock`, `features/MapInfoBlocks`, а также `shared/CustomSelect/ui/CustomSelect.tsx`
(от слайса остались шит с колесом, хук выбора и тип опции — их держит `GlassSelect`).

Заодно ушёл сломанный реэкспорт `ITabWithBackground` из `shared/TabBar/index.ts` — он был
одной из предсуществующих ошибок `tsc`.

### 4. Токенный долг

`COLORS.Icon.*` → `COLORS.TEXT.*` в 12 местах, затем из **обеих** палитр удалены неймспейсы
`Icon`, `BRAND`, `SUCCESS`, `ERROR`. `COLORS` и `COLORS_DARK` по-прежнему совпадают по набору
ключей (9 и 9) — этого требует `IThemeStore`, где палитра типизирована как `typeof COLORS`.

Проп `type` у `Typography` стал **обязательным**, старая половина `TYPOGRAPHY_SCALE` удалена.
Компилятор на этой правке нашёл два последних следа дефолта, которые грепом не видны:
внутренний фоллбэк `?? TYPOGRAPHY_SCALE.bodySmall` в самом `Typography` и необязательный
`type` у `AnimatedNumber`. Оба закрыты — у `AnimatedNumber` проп тоже стал обязательным,
оба его потребителя и так его передавали.

### 5. Документация проекта

Правила описывали состояние, которого больше нет, — обновлены:

- [styling.md](../.claude/rules/styling.md) — структура палитры, пример `Typography`,
  цвет SVG, весь список UI-кита (переписан по группам) и правило про `PressableScale`;
- [design.md](../.claude/rules/design.md) — старая лестница помечена удалённой,
  `CustomPieChart` → `DonutChart`;
- [dependencies.md](../.claude/rules/dependencies.md), [imports.md](../.claude/rules/imports.md) — примеры обёрток и импорта;
- [code-style.md](../.claude/rules/code-style.md) и [CLAUDE.md](../CLAUDE.md) — счётчик
  предсуществующих ошибок `tsc` (было «~39», фактически 13, сейчас 5).

---

## Проверка

**Типы.** Baseline до работы — 13 ошибок `npx tsc --noEmit`. Итог — **5**. Разница не в том,
что что-то починено: 8 ошибок жили в удалённых файлах (`CustomInput.tsx` ×3,
`CustomSelect.tsx` ×3, `CustomButton.tsx`, `TabBar/index.ts`). Оставшиеся 5 —
предсуществующие и к дизайну не относятся: типизация двух роутов, JSX-namespace в
`WheelPicker` (×2), стиль в `TabBarWithBackground`.

**Греп-проверки — все пустые:**

```
grep -rnE 'COLORS\.(Icon|BRAND|SUCCESS|ERROR)\.' src
grep -rnE 'type="(display|headline|bodyAccent|caption"|body(Large|Medium|Small))' src
```

Ссылок на удалённые слайсы в `src` не осталось (проверено по каждому имени отдельно).
`<Typography>` без `type=` — ноль (теперь это ещё и ошибка компиляции).

### Что НЕ проверено — нужен прогон на устройстве

Тестов и линтера в проекте нет, дев-билд отсюда не запускался. В Expo Go не заработает —
нужен `expo-dev-client`. Пройти руками в **обеих темах** (переключатель в Профиле):

1. **Оффлайн:** выключить сеть → любой внутренний экран → новое центрированное состояние.
2. **Ошибка загрузки** (заглушить бэкенд): Главная, Цены, Новости, Акции, Профиль, Кофе,
   Кофе-бонус, статьи (О компании / О приложении / Помощь), выбор АЗС, выбор топлива —
   везде состояние с рабочей кнопкой «Попробовать снова».
3. **Разрешение камеры:** отозвать доступ → сканер → «Разрешить» (лаймовая кнопка).
4. **Заправка → «Сканировать QR»:** шапка со стрелкой назад, лаймовая рамка с лазером,
   подсказки карточками. Реальный QR с колонки должен по-прежнему заполнять АЗС и колонку.
5. **Акции при пустом списке** — центрированное состояние, без гифки.
6. **Главная → обмен бонусов:** поле суммы, чипы «Половина» / «Все N B», отправка.
7. **Модалки:** акция с главной, QR на Балансе (радиус вырос с 15 до 28), диалоги
   подтверждения в Профиле.
8. **Колесо-пикер** выбора колонки: кнопки «Отменить» / «Подтвердить» — теперь `PillButton`.
9. **Экраны с `useInput`:** вход, регистрация, код из SMS/звонка, приглашение пользователя.
10. **Кофе:** переключение вкладок «Мой кофе» / «Купить» (хук сменил источник).

---

## Что осталось

- **Маршрут `/products`** объявлен в `ESCREENS`, но переходов на него нет **ни одного**.
  Виджет переведён на `CenteredState`, сам маршрут не трогали — удалять его или дать
  на него вход, решать отдельно.
- **5 предсуществующих ошибок `tsc`** — не относятся к дизайну, отдельная задача.
- **`react-native-gifted-charts`** остался в `package.json` без потребителей (отмечено ещё
  в [history-redesign-21vek.md](history-redesign-21vek.md)). Снять вместе со следующей
  чисткой зависимостей — правка `yarn.lock` походя запрещена правилом 6 [code-style.md](../.claude/rules/code-style.md).
- **`shared/WheelPicker`** — вендорная копия библиотеки со своими ошибками типов, живёт под
  `CustomSelectBottomSheet`. Кандидат на замену или на приведение к правилам `shared/`.
- Два пустых каталога-остатка не от этой работы: `shared/BottomMenu/assets/icon`,
  `shared/Icons/FuelIcon/assets/icon`.
