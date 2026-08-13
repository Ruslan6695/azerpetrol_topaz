# Передизайн экрана «Профиль» + экраны «Настройки» и «Удаление аккаунта» под макет «21 Век»

## Описание задачи

Профиль оставался одним из последних крупных экранов на старой вёрстке: карточки на `BACKGROUND.Tertiary` вместо стекла, `displayMedium`/`bodyAccentSmall` вместо новой лестницы, самодельные строки меню с бордерами и **три разные оболочки у модалок на одном экране** (два `BottomSheet` и один `CustomModal`).

Кроме внешнего вида экран тянул за собой архитектурный тупик: пункт меню «Удаление аккаунта» вёл на `ESCREENS.SETTINGS`, но `onPress` перебивал навигацию и открывал боттом-шит, а сам `SettingsScreen` был пустой заглушкой, которая **даже не импортировала свой процесс**.

Макет — [`design/21vek-app.dc.html`](../design/21vek-app.dc.html), флаг `showProfile`, строки **243–285**; связанные экраны: `showSettings` (625–633), `showDelete` (635–643), модалка `showRemoveConfirm` (684–694).

**Бэкенд не менялся:** `GET profile/` отдаёт то же самое, двухшаговое удаление аккаунта (`delete` → код → `confirm`) сохранено полностью.

---

## Решения, принятые с заказчиком

| Вопрос | Решение |
|---|---|
| Объём | Профиль + Настройки + Удаление аккаунта одним заходом |
| Модалки профиля | Обе переведены на единую оболочку |
| Мёртвый код в переписываемых файлах | Вычищен |
| `ScreenTitle` «Профиль» | **Оставлен** вопреки макету (там экран начинается с аватара) |
| SMS-подтверждение удаления | Сохранено; один экран, два шага |
| Тумблеры уведомлений из макета | **Не делаем.** Заменены на реальную настройку «Объём бака» |
| Кнопка «Выйти» | С подтверждением (в макете выход мгновенный) |
| Экран налива топлива | В этот заход не трогали |

---

## Что было сделано

### 1. Четыре новых токена палитры

Добавлены в **обе** палитры — наборы ключей `COLORS` и `COLORS_DARK` обязаны совпадать (`IThemeStore` типизирует палитру как `typeof COLORS`).

```ts
STATE: {
    // Выключенный трек свитча. Включённый — ACCENT.Primary.
    SwitchTrackOff: 'rgba(10,32,51,0.2)',   // dark: 'rgba(255,255,255,0.2)'
    // Ручка свитча белая в обеих темах — так в макете.
    SwitchKnob: '#FFFFFF',
},
GLASS: {
    // Тонировки внутри плитки связанного аккаунта.
    TileAvatar: 'rgba(255,255,255,0.25)',
    TileClose: 'rgba(0,0,0,0.2)',
},
```

`SwitchTrackOff` в светлой теме — точное значение макета (`switchBg`, строка 852). **В тёмной теме макет свитч в выключенном состоянии не рисует** — значение подобрано к палитре, помечено комментарием в коде.

`TileAvatar` / `TileClose` — тонировки поверх лайма или стекла, поэтому одинаковы в обеих темах (тот же приём, что у `ACCENT.OnLime` и `STATE.*Soft`).

**Файл:** [`src/shared/common/config/constants/COLORS.ts`](../src/shared/common/config/constants/COLORS.ts)

---

### 2. `shared/Switch` — новый примитив UI-кита

Единственный компонент макета, которого в ките не было. Трек 48×28, ручка 22 едет `left: 3 → 23` с пружинной кривой `cubic-bezier(.3,1.4,.5,1)` (макет, строки 851–852).

Одна `useDerivedValue` питает и сдвиг ручки, и цвет трека через `interpolateColor` — иначе анимация и перекраска разъезжаются.

**Свитч намеренно не нажимаемый сам по себе:** в макете тапается вся строка. Проп `onValueChange` опционален и оставлен на будущее — если он передан, компонент оборачивается в `PressableScale`.

**Файлы:** [`src/shared/Switch/ui/Switch.tsx`](../src/shared/Switch/ui/Switch.tsx), [`index.ts`](../src/shared/Switch/index.ts)

---

### 3. `shared/ConfirmDialog` — единая оболочка подтверждений

До этого три подтверждающих диалога профиля выглядели тремя разными способами. Обобщён состав, который уже был собран вручную в `ConvertBonusModal`: круг 64 → заголовок `num18` → тело `body125` → две `PillButton size="lg"`.

Пропы: `isOpened`, `onClose`, `onConfirm`, `title`, `description?`, `confirmLabel`, `cancelLabel?`, `variant?: 'destructive' | 'accent'`, `icon?`, `loading?`.

Заменил собой **три** места: `DeleteJoinAccountModal`, `LeaveFromProfileJoinAccountsModal` и новое подтверждение выхода.

**Файлы:** [`src/shared/ConfirmDialog/ui/ConfirmDialog.tsx`](../src/shared/ConfirmDialog/ui/ConfirmDialog.tsx), [`config/types/TConfirmDialogVariants.ts`](../src/shared/ConfirmDialog/config/types/TConfirmDialogVariants.ts)

---

### 4. Правки двух общих компонентов — обратносовместимые

**`CustomModal`** получил `hideHeader?: boolean` (дефолт `false`): у диалогов подтверждения в макете нет крестика, а `CustomModal` всегда рисовал верхний ряд с `CloseIcon`. Ни один существующий вызов не изменился.

**`CenteredState`** получил `circleSize?: number` (дефолт 96 — макет экрана удаления рисует 88) и `action.loading` / `action.disabled`, чтобы кнопка «Удалить навсегда» показывала спиннер запроса, а не подменяла экран лоадером.

⚠️ `CenteredState` использует `flex: 1`, но внутри `InternalPagesLayout` контент лежит в `KeyboardAwareScrollView` без `flexGrow: 1` — вертикального центрирования не будет, блок ляжет сверху с `paddingVertical: 60`. Это близко к макетному `padding-top: 100`; layout не трогали.

---

### 5. Объём бака — новая настройка вместо тумблеров уведомлений

Макет рисует на Настройках два тумблера уведомлений, **оба статичные, без обработчиков и без источника данных**. Вместо них по решению заказчика сделана реальная настройка.

Хранится в `FuelStore`, но **рядом с `state`, а не внутри него** — `clearState()` вызывается после налива и стёр бы пользовательскую настройку:

```ts
tankVolume: DEFAULT_TANK_VOLUME,
changeTankVolume(volume) { /* set + setItemToAsyncStorage */ },
async getTankVolume() { /* мусор или пусто → остаётся дефолт */ },
```

- Ключ `EAsyncStoreKeys.TANK_VOLUME = 'tankVolume'`
- Константы `DEFAULT_TANK_VOLUME = 50`, `MIN = 10`, `MAX = 200`, `PRESETS = [40, 50, 60, 70]` — в `shared`, потому что дефолт нужен самому стору, а пресеты понадобятся будущему потребителю в `features/Fuel`
- Гидрация — `getTankVolume()` в `useEffect` корневого `_layout.tsx`, рядом с восстановлением темы

⚠️ **У настройки пока нет потребителя.** Экран налива в этот заход не трогали, поэтому «полный бак» нигде не применяется — значение только сохраняется. См. «Что осталось».

⚠️ **Границы 10–200 л с заказчиком не согласованы** — подобраны по легковым авто.

**Файлы:** [`fuelStore.ts`](../src/shared/common/model/fuelStore.ts), [`IFuelStore.ts`](../src/shared/common/config/interfaces/IFuelStore.ts), [`TANK_VOLUME.ts`](../src/shared/common/config/constants/TANK_VOLUME.ts), [`EAsyncStoreKeys.ts`](../src/shared/common/config/enums/EAsyncStoreKeys.ts)

---

### 6. Экран Профиля

Композиция ([`Profile.tsx`](../src/proccesses/Profile/ui/Profile.tsx)) — корневой `View` с `gap: SPACING.MD`, вместо инлайнового ряда «заголовок + иконка темы».

**Сохранено без изменений:** `useFetchData`, `useFocusEffect`, и главное — `afterDataCallback` → `UserStore.setBalance()`. Этим питается `HeaderWallet` в шапке табов.

| Блок | Было | Стало |
|---|---|---|
| Аватар | `ProfileImg` (SVG-заглушка), `displayMedium` / дефолт | `Glass` круг 86 + `Icon person 40`, `h5` / `body14 secondary` |
| Тема | иконка 35×35 в шапке рядом с заголовком | стеклянная строка `glass2 r24` со `Switch`, под аватаром |
| Связанные аккаунты | `BACKGROUND.Tertiary`, `radius 16`, иллюстрация `join.svg` с `MPLayout mt={-30}` | `GlassCard glass`, `RADII.CARD`, без иллюстрации |
| Плитка аккаунта | `radius 8`, высота 98, фон `BRAND.Primary` у создателя | ширина 100, `RADII.INPUT`, **лайм** у создателя, круг-аватар 36, «✕» в кружке |
| Меню | самодельные строки с бордером 2px | `ListGroup` + 6 × `ListRow right="chevron"` |
| «Выйти» | строка со стрелкой, разлогин сразу | центрированный текст `STATE.Destructive` + `ConfirmDialog` |

**Пункт «Удаление аккаунта» заменён на «Настройки»** с настоящей навигацией — тупик ликвидирован.

---

### 7. Экран Настроек — из заглушки в рабочий

`SettingsScreen` не импортировал `Settings` (процесс не был подключён нигде в проекте). Теперь:

- [`SettingsScreen`](../src/screens/SettingsScreen/ui/SettingsScreen.tsx) → [`proccesses/Settings`](../src/proccesses/Settings/ui/Settings.tsx)
- `features/Settings/ChangeTankVolume` — `GlassCard` + `AmountField` (`suffix="л"`, кламп min/max встроен) + чипы-пресеты. Паттерн один в один с `PayBalanceForm`
- `features/Settings/OpenDeleteAccountScreen` — `ListRow destructive` с иконкой `profile_delete_acc`

---

### 8. Экран Удаления аккаунта — новый маршрут

Три шага по [navigation.md](../.claude/rules/navigation.md): файл роута → `ESCREENS.DELETE_ACCOUNT` + `SCREENS_TITLES` → регистрация в `_layout.tsx`.

`features/DeleteAccount` переписан из боттом-шита в экран (`DeleteAccountModal.tsx` → `DeleteAccount.tsx`):

- **Шаг 1** — `CenteredState variant="error" circleSize={88}` с двумя кнопками
- **Шаг 2** — `SendSmsCallCodeForm` на том же экране внутри `GlassCard`

**Боевая логика сохранена целиком:** `road`, `callSmsType`, оба `useSendFetch`, переключение звонок ↔ SMS, тост и `logout()`. Изменилось только то, что при ошибке вместо закрытия шита идёт `router.back()`, а после успеха ничего закрывать не нужно — `logout()` сам переключает `Stack` в корневом layout.

⚠️ `api/deleteAccountApi.ts` **не тронут**.

---

### 9. Вычищено

| Что | Почему |
|---|---|
| `entities/Profile/ProfileLinkItem` (слайс целиком) | Сущность делала `router.navigate` — это `features` по [architecture.md](../.claude/rules/architecture.md) правило 1. Единственный потребитель переписан на `ListRow` |
| Мёртвая константа `items` в `MapProfileLinkItems` | Полный дубль `useMemo` внутри компонента |
| 7 SVG в `MapProfileLinkItems/assets/` | Проп `icon` деструктурировался, но **в JSX не рендерился** — иконки грузились впустую |
| 4 SVG в `ChangeColorTheme/assets/` | `moon`/`sun` уже есть в общем наборе `ICONS` |
| 2 SVG в `ProfileJoinAccountsWidget/assets/` | Иллюстрации в макете нет |
| Мёртвый импорт `ChangeColorTheme` в `ProfileWidget` | Компонент не рендерился |
| `joinAccounts.reverse()` | **Мутировал проп**, который лежит в `data` хука `useFetchData`. Заменён на `[...joinAccounts].reverse()` в `useMemo` |
| `gap: 10` без `SIZES.PX` | Нарушение [styling.md](../.claude/rules/styling.md) правило 3 |
| `borderRadius` без фона и `overflow` в `ProfileLinksWidget` | Декоративный радиус, ни на что не влиявший |
| 3 × `.DS_Store` | — |

Перед удалением каждого файла проверено grep'ом, что на него никто не ссылается. `ProfileImg` **не удалён** — его использует `ConfirmAddJoinAccountModal`, который в этот заход не редизайнился.

---

## Проверка

- `npx tsc --noEmit` — **23 ошибки до, 23 после**; ни одной в затронутых файлах (базовая линия оказалась 23, а не ~39 как записано в CLAUDE.md — часть уже починена ранее)
- `npx expo export --platform ios` — бандл собирается, битых импортов после удаления ассетов нет
- `npx prettier --check` — новые и переписанные файлы отформатированы по конфигу. `shared/index.ts` и `IFuelStore.ts` остались в своём (несоответствующем) стиле: они были такими до правок, переформатирование раздуло бы диф
- Хардкод-цветов, голых `<Text>`, `TouchableOpacity` и размеров без `SIZES.PX` в новых файлах нет
- Типы маршрутов `expo-router` перегенерированы (`.expo/types/router.d.ts`)

**Не проверено на устройстве** — нужен dev-билд. Обязательный ручной прогон:

1. Профиль → баланс в шапке обновляется при возврате на таб (проверяет, что `setBalance` уцелел)
2. **Обе темы**: контраст ручки `Switch` на треке; круг-аватар внутри плитки (`TileAvatar` — белый 25% на `GLASS.Secondary`, в светлой теме может не читаться); «✕» (`TileClose` — чёрный 20%) в тёмной теме
3. Android без блюра: аватар-круг отдаёт `GLASS.SolidSecondary` — должна остаться граница `GLASS.Border`
4. Удаление аккаунта: **оба** пути — звонок и SMS; ошибка первого шага уводит назад
5. Настройки: ввести 70 → убить приложение → значение сохранилось. Отдельно — стирание всех цифр в `AmountField` (прыжок на `min`)
6. Скелетоны профиля не «прыгают» при переходе в реальную вёрстку

---

## Расхождения с макетом — осознанные

| Что | Решение |
|---|---|
| Кнопки 50/52 px | Новый размер `PillButton` не заводили, используется `lg` (54) — прецедент `ConvertBonusModal` |
| Глиф «!»: макет 36/28, у нас `h1` (40) и `h5` (24) | Мирятся, пропа размера глифа не заводили |
| `ListRow` 15/18 против макетных 16/18 у строки «Удалить аккаунт» | Мирится |
| `CenteredState.description` — `body14` против макетного `body13` | Мирится |
| `ScreenTitle` «Профиль» | Оставлен по решению заказчика; в макете его нет |
| Тумблеры уведомлений | Заменены на «Объём бака» |
| Выход из аккаунта | Добавлено подтверждение; в макете выход мгновенный |
| Трек свитча в тёмной теме | Значения в макете нет, подобрано |

---

## Что осталось

- **Подключить объём бака к наливу.** Настройка сохраняется, но потребителя нет. Когда дойдёт очередь до `features/Fuel/SelectLiters`: чип «Полный бак — N л» + `MAX_LITERS = 60`, захардкоженный в `FuelLitersSelector`, заменить на `tankVolume`. Учесть, что бэку в `fuelling/start/` уходит **сумма в рублях**, а не литры
- **Согласовать границы объёма бака** (сейчас 10–200 л)
- **Экран «Приглашение пользователя»** (`ESCREENS.ADD_JOIN_AСCOUNT`) — доступен из профиля, но не переделан
- **Подэкраны меню:** История операций, Новости, статейные экраны (`features/GetArticle` закрывает сразу три)
- **`entities/ErrorWhileFetchingForm`** — рендерится на профиле при ошибке загрузки, остался старым. Blast radius 18 файлов, это отдельная задача
- **Существующий баг в `FuelStore.clearState()`** — не сбрасывает `trkType` и `rubles`. Обнаружен при работе со стором, не чинили: к задаче не относится
