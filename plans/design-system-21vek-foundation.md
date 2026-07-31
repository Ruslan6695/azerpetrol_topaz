# Дизайн-система «21 Век» — фундамент

Первый заход редизайна под макет из Claude Design. Объём — **только фундамент**: токены, шрифты, набор иконок, примитивы UI-кита и оболочка приложения. Ни один экран не переверстан.

Расчёт был на то, что тема живёт в zustand-сторе (`ThemeStore.useCOLORS()`), а ~200 компонентов строят `StyleSheet.create` внутри `useMemo([COLORS])`. Значит перенаправление значений в `COLORS.ts` меняет вид всего приложения без правки экранов.

---

## 0. expo-blur

```
yarn add expo-blur@~15.0.8 --ignore-engines
```

`npx expo install expo-blur` падает: Node 21.2 несовместим с движковым требованием транзитивного `glob@13` (`"20 || >=22"`). Поставлено напрямую с `--ignore-engines`, версия та же, что подобрал бы Expo для SDK 54.

Config-плагин не нужен — модуль автолинкуется.

⚠️ **Нужен новый dev-билд** (`eas build --profile development -p ios`). Приложение на `expo-dev-client`, и без пересборки `BlurView` не загрузится. Билд не запускался — это ручное действие.

---

## 1. Дизайн-референс, правило, агент

| Файл | Что |
|------|-----|
| `design/21vek-app.dc.html` | Локальная копия прототипа (107 КБ, 941 строка) |
| `design/DESIGN_SPEC.md` | Выжимка: токены dark/light, словарь из 16 повторяющихся компонентов, опись всех ~30 экранов с диапазонами строк, ассеты, поведение анимаций |
| `.claude/rules/design.md` | Ссылка на проект и `projectId`, таблица соответствия макет ↔ токены, чего нет в RN и чем заменять, порядок работы над экраном |
| `.claude/agents/design-reader.md` | Новый агент: читает макет, выдаёт спеку экрана сразу в токенах проекта |
| `CLAUDE.md` | Ссылка на дизайн в разделе Project, строка `design.md` в таблице Rules, `design-reader` в Agents |

Смысл локальной копии: агент читает файл с диска, а не тянет 107 КБ по MCP на каждый вопрос.

Разделение с существующим `redesign-scout`: **reader читает макет** («как должно быть»), **scout читает код** («как устроено сейчас»). Порядок работы над экраном — reader → scout → правки.

---

## 2. Токены

### `src/shared/common/config/constants/COLORS.ts`

Существующие ключи **перенаправлены**, новые группы **добавлены**. Ключи не удалялись: `IThemeStore.COLORS` типизирован как `typeof COLORS`, и обе палитры обязаны совпадать по набору ключей.

Перенаправлено (light → dark):
- `BACKGROUND.Primary` `#FFF`/`#1F1F1F` → `#E4E9DD`/`#0A0E0B`
- `BACKGROUND.Secondary` `#DEDEDE` → `rgba(10,32,51,.08)`/`rgba(255,255,255,.10)`
- `BACKGROUND.Tertiary` `#F0F0F0`/`#272727` → `rgba(255,255,255,.55)`/`rgba(255,255,255,.06)`
- `BACKGROUND.Invert`, `TEXT.Primary` (только dark: `#FFFFFF` → `#F2F6EE`), `TEXT.Secondary`, `TEXT.Tertiary`, `Icon.Primary`, `Icon.Secondary`
- `ERROR.Primary` и `TEXT.Error` `#FF4D34` → `#FF6B54`

Не тронуты: `BRAND.Primary` `#00C12A` и `SUCCESS.Primary` `#12C85B` — уже совпадали с макетом. `TEXT.Invert` оставлен белым: это подпись ~33 кнопок на зелёном `BRAND.Primary`, который не менялся.

Добавлены группы: `GLASS` (Primary / Secondary / Border / SolidPrimary / SolidSecondary / Surface), `ACCENT` (Primary / Lime / OnLime), `STATE` (Destructive / Positive / Disabled), `AMBIENT` (цвета и прозрачность блобов), `EFFECTS` (BlurTint / BlurIntensity).

`GLASS.Solid*` — цвет стекла, предкомпозированный на фон: фоллбэк для Android и для `blur={false}`.
`GLASS.Surface` — непрозрачная поверхность модалок и шитов.
`EFFECTS.BlurTint` типизирован `as 'light' | 'dark'`, иначе TS расширил бы до `string` и `<BlurView tint>` его не принял бы.

### Новые константы

`RADII.ts`, `SPACING.ts`, `PRESS_SCALE.ts`, `BLUR.ts`, `FONTS.ts` — все в `shared/common/config/constants/` и все дописаны в `src/shared/index.ts`.

`RADII.PILL = 999` используется сырым; всё остальное домножается на `SIZES.PX` на месте.
`BLUR.ts` даёт `CAN_BLUR = Platform.OS === 'ios'` — на Android настоящий backdrop-blur требует экспериментального `dimezisBlurView`, который перерисовывает иерархию каждый кадр.

### Правки, обязательные в том же заходе

`BACKGROUND.Tertiary` стал полупрозрачным, а его использовали как поверхность 43 файла. Всплывающие панели над затемнённым бэкдропом просвечивали бы:

- `CustomModal.tsx` → `GLASS.Surface`; убрана ветка `white ? '#ffffff'` (белая вспышка в тёмной теме). Проп `white` оставлен в сигнатуре для совместимости.
- `BottomSheet.tsx` → `GLASS.Surface`
- `CustomSelectBottomSheet.tsx` → `GLASS.Surface`; заодно стили перенесены с уровня модуля внутрь компонента (использовали статическую светлую палитру — тёмная тема их не брала), убран `customColor="#0A2033"` у заголовка, `WheelPicker` теперь получает `backgroundColor` из палитры вместо дефолтного `#FFFFFF`
- `CUSTOM_BUTTON_COLORS.ts` — `DISABLED` → `STATE.Disabled`, `SECONDARY` → `GLASS.Primary`/`GLASS.Secondary`

Починены две утечки статической палитры (нарушение `styling.md`, правило 1): `SuccessImage.tsx` и `WarningImage.tsx` — `StyleSheet.create` перенесён внутрь компонента + `ThemeStore.useCOLORS()`, круг перекрашен в `ACCENT.Lime` по макету. `SuccessImage` заодно начал уважать пропсы `width`/`height`, которые раньше игнорировал.

---

## 3. Шрифты и типографика

`useSetFonts.ts` — зарегистрированы `Manrope-Bold` и `Manrope-ExtraBold` (файлы уже лежали в `assets/fonts/`, нативная пересборка не нужна).

`FONTS.ts` — четыре начертания. Ключевое: `Manrope-SemiBold` — это и есть вес 600, поэтому все «600» макета уже были покрыты; реально новые только 700 и 800.

`Typography.tsx` — `switch` вынесен в таблицу `Typography/config/constants/TYPOGRAPHY_SCALE.ts`, `TTypographyTypes = keyof typeof TYPOGRAPHY_SCALE`.

**Существующие 13 типов не перенаправлялись** — они стоят в ~104 местах, включая подпись каждой `CustomButton` и заголовок каждой `CustomModal`. Смена их размеров была бы переверсткой.

Добавлена лестница макета: `h1`–`h6`, `num20/18/16/15` (800), `rowTitle`, `label14`, `label13` (700), `body14/13/125`, `caption12/11/10`, `tabLabel`, `eyebrow` (600). `eyebrow` несёт собственные `letterSpacing`, `textTransform: uppercase` и цвет `secondary` — явный проп `color` их перебивает.

В стиль добавлены `letterSpacing` (тоже `* SIZES.PX`) и `textTransform`.

---

## 4. Иконки и логотипы

26 иконок и 2 вордмарка скачаны через `DesignSync.get_file`.

**Плейсхолдер-цветов оказалось больше одного.** В макете встретились `#858585`, `#848F99`, `#636F74`, `#616C71`, `#94A1A7`, `#4C5159`, `#558E3B`, `#171717`, `black`, `white`. Все нормализованы на `currentColor` — `react-native-svg` резолвит его из пропа `color` корневого `<Svg>`. Атрибуты `width`/`height` сняты (оставлен `viewBox`), чтобы выигрывали пропсы компонента.

`fill="white"` внутри `<clipPath>` и `<mask>` **оставлен как есть** — это маски, а не заливка иконки.

`.svgrrc.js` не тронут: глобальное правило переписало бы 8 уже существующих svg, использующих те же цвета.

Размещение — плоский реестр вместо 26 слайсов (конвенция `Icons/<Name>Icon/{index,ui,assets}` дала бы 78 файлов одинаковых трёхстрочных компонентов; она существует ради тем-вариантов, которых у нового набора нет):

```
src/shared/Icons/
    index.ts                       Icon, TIconName
    ui/Icon.tsx                    { name, size = 24, color, opacity }
    config/constants/ICONS.ts      карта name → React.FC<SvgProps>
    config/types/TIconName.ts
    assets/*.svg                   26 файлов
    ArrowIcon/ CoffeeIcon/ …       11 существующих слайсов не тронуты
```

`coffee_scan.svg` и `fuel_scan.svg` в макете побайтово идентичны — второй скопирован с первого.

`src/shared/Logo/ui/Wordmark.tsx` — вордмарк с выбором файла по `ThemeStore.useTheme()`, `RATIO = 849.942 / 145`, проп `height = 15`. Существующие `Logo` и `LogoFull` не тронуты.

`assets/img/fuel.jpeg` не скачивался: `get_file` отдаёт текст, а в этом заходе картинка никем не используется.

---

## 5. Примитивы UI-кита

`CustomButton` (33 файла), `CustomInput` (13), `CustomTouchableOpacity` (38) не тронуты и на новые примитивы не мигрированы — перенаправления токенов им достаточно.

Новые:

| Компонент | Сигнатура |
|-----------|-----------|
| `PressableScale` | `{ children, onPress, onLongPress, scaleTo = PRESS_SCALE.BUTTON, disabled, style, hitSlop, dismissKeyboard = true }` — reanimated, как и `CustomTouchableOpacity` прячет клавиатуру |
| `GlassCard/ui/Glass.tsx` | `{ children, level, radius, blur, bordered, style }` — **единственный** файл с импортом `BlurView` |
| `GlassCard` | `{ children, variant: 'glass'\|'glass2'\|'hero'\|'lime', radius, padding, blur, bordered, onPress, style }`; `hero`/`lime` — градиенты через `expo-linear-gradient` |
| `PillButton` | `{ title, onPress, variant: 'primary'\|'secondary'\|'elevated'\|'destructive', size: 'lg'\|'md'\|'sm', disabled, loading, icon, fullWidth, style }` |
| `GlassInput` | `TextInputProps` + `{ label, error, icon, rightSlot, mask, maskType, height }` — логика маски и обрезки пробелов перенесена из `CustomInput` |
| `Chip` | `{ label, selected, onPress, icon, variant, size, style }` |
| `StatusPill` | `{ label, tone: 'positive'\|'destructive'\|'neutral'\|'lime', icon }` |
| `SectionTitle` | `{ children, action?: { label, onPress } }` |
| `ListRow` / `ListGroup` | строка с иконкой/чевроном/значением и стеклянная группа с hairline-разделителями |
| `CenteredState` | `{ variant: 'empty'\|'success'\|'error', title, description, icon, action, secondaryAction }` |

Рестайл на месте (сигнатуры не менялись → ноль правок у потребителей):

- `Skeleton/ui/Skeletons.tsx` — 30 потребителей. Градиент `GLASS.Primary → Secondary → Primary`, `locations [.25,.4,.55]`, ширина 720, проезд `-360 → 360` за 1.1 с `Easing.linear`, радиус `RADII.INPUT`. Убран хардкод `#F6F9FC`. Добавлен `animation.stop()` в cleanup (раньше цикл не останавливался на unmount).
- `TabBarWithBackground` + `TabWithBackground` — сегмент-контрол макета: трек стал стеклянной пилюлей с padding 4, активный сегмент — лайм с текстом `ACCENT.OnLime`, убраны логика `isFirst/isLast` и `label.toUpperCase()`.

`Loader` получил необязательный `customColor` — индикатор на лаймовой кнопке иначе нечитаем. Проп опциональный, существующие вызовы не затронуты.

---

## 6. Оболочка

### `AmbientBackground` (новый)

Два дрейфующих радиальных блоба позади контента. Дрейф — reanimated 4: `withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, true)`, блоб A 9 с, блоб B 11 с в обратной фазе.

**Размытие сделано рампой прозрачности градиента (стопы 0% / 40% / 70%), а не SVG-фильтром.** `<FeGaussianBlur>` в `react-native-svg` 15 нестабилен на Android/New Arch и дорог; по сплошному кругу результат визуально неотличим от `blur(30px)`. Это записано комментарием в коде, чтобы позже никто не «починил».

Старый `BackgroundImage` и три его экранных потребителя (`OpenFuelScreen`, `AnimateFuelLoading`, `FuelLoadingStartWidget`) оставлены — это декор экранов.

### Таб-бар

`BOTTOM_MENU_ITEMS` перестал быть функцией от темы и схлопнулся с 20 импортов до нуля — по одной `currentColor`-иконке на таб. `IBottomMenuItem` → `{ name: TIconName; link: string; title: string }`.

`BottomMenu` — плавающий: `position:'absolute'`, `left/right 16`, `bottom 18 + insets.bottom`, радиус 30, стекло `level="secondary"`, тень `0 8px 28px rgba(0,0,0,.18)`. Структура **внешний View (тень/elevation) → Glass (скругление + блюр) → items**: на Android `overflow:'hidden'` гасит `elevation`, поэтому они не могут лежать на одном View.

`BottomMenuItem` переписан: иконка 22 в пилюле `RADII.PILL` с фоном `ACCENT.Lime` при активности, подпись `tabLabel`. В светлой теме подпись активного таба тёмная — лайм на светлом фоне не читается. Удалены `isMain`/`homeEllipse`. `<Link>` заменён на `router.navigate` — `<Link>` вокруг `<View>` мешал раздаче `flex:1`. Утечка статической палитры в этом файле починилась заодно.

20 устаревших svg в `BottomMenu/assets/` оставлены на диске — уборка отдельным заходом.

### Шапки и лэйауты

- `MainHeaderWidget` — убран хак `Device.osName` для высоты (его заменил safe-area), padding `14/20`, `<Logo size={50} />` → `<Wordmark height={15} />`.
- `HeaderWallet` — стеклянная пилюля `RADII.PILL` с padding `7/14`, обёрнута в `PressableScale`, иконка кошелька из нового набора, баланс `label14`, `BonusIcon` 16 без тонировки.
- `InternalPagesHeader` — круглая стеклянная кнопка «назад» 38×38 в `PressableScale` со `scaleTo={PRESS_SCALE.BACK}`, заголовок `displaySmall` → `num18`.
- `(main)/_layout.tsx` — фон `BACKGROUND.Primary`, `edges` `['bottom',…]` → `['top',…]` (низ уходит под плавающий бар), `AmbientBackground`, `paddingBottom: SPACING.TABBAR_CLEARANCE`.
- `InternalPagesLayout` — `AmbientBackground`, `paddingBottom: 40`, убраны мёртвый импорт статического `COLORS` и висячий `{' '}`.

Аудит вложенных скроллеров: вертикальных скроллеров внутри табов нет. `MapProfileJoinAccounts` горизонтальный, `MapHistoryItems` живёт на `/history` вне `(main)` (там таб-бара нет), `MapCoffeeItems` импортирует `ScrollView`, но не использует.

---

## 7. Уборка

`EScreens.ts` — удалён дубль `FUEL_PRICES` (был объявлен на строках 16 и 29), давал `TS2300` ×2.

---

## Верификация

Тестов и линтера в проекте нет — **тесты не запускались, потому что их не существует**.

| Проверка | Результат |
|----------|-----------|
| `npx tsc --noEmit \| grep -c "error TS"` | **36** при базе 39 |
| Дифф ошибок по файлам против базы | только удаления, ни одной новой |
| `npx expo export --platform ios` | собирается, бандл 8.39 МБ |

Три ушедшие ошибки: 2 — дубль `FUEL_PRICES`, 1 — переписанный `BottomMenuItem`.

Базовая линия снималась через `git stash` рабочего дерева, чтобы сравнение было честным, а не «на глазок».

### Что НЕ проверено

**Приложение не запускалось.** Нужен новый dev-билд ради `expo-blur`, а `eas build` не запускался. До этого не проверено глазами ничего из визуального:

| Экран | Что смотреть |
|-------|--------------|
| `/login` (разлогиненным) | `LoginRegistrationLayout` использует `BACKGROUND.Primary` дважды — самая вероятная регрессия, и она до авторизации |
| `/home` | дрейф блобов, вордмарк + чип баланса, плавающий бар, плитки стали стеклянными |
| `/fuel`, `/coffee`, `/balance`, `/profile` | бар не перекрывает последнюю строку, лаймовая пилюля и цвет подписи в обеих темах |
| `/history` | новый шиммер + `CustomPieChart` на `rgba()`-токенах |
| `/transferBalance` | боттом-шит `CustomSelect` — непрозрачный ли `GLASS.Surface` |
| любая промо-модалка | `CustomModal` — нет ли белой вспышки в тёмной теме |
| `/success` | `SuccessImage` после починки |
| Android | непрозрачный фоллбэк вместо блюра, отсутствие просадок под скроллом |

Отдельный риск: сторонние компоненты, которым теперь приходит `rgba()` — `react-native-gifted-charts` на `/history` и `react-native-calendar-range-picker` в `RangePicker`. Если поломаются — отдать им `GLASS.SolidPrimary`.

---

## Сознательно не сделано

- Ни один экран не переверстан. Постраничная переделка — следующие заходы: `design-reader` (макет) → `redesign-scout` (код) → правки.
- Не добавлены новые экраны макета: Настройки с тумблерами, Удаление аккаунта, сканер кофемашины.
- `CustomButton`/`CustomInput`/`CustomTouchableOpacity` не мигрированы на `PillButton`/`GlassInput`/`PressableScale` — новые компоненты пока использует только оболочка.
- Не удалены 20 устаревших svg таб-бара, `BackgroundImage` и три его экранных потребителя.
- 11 существующих слайсов `src/shared/Icons/*Icon` не мигрированы в новый реестр.
- `.svgrrc.js` не тронут.
- 36 оставшихся ошибок `tsc` — фоновый долг, не задача этого захода.
- `fuel.jpeg` не скачан.
