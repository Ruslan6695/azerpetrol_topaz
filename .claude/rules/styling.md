# Стили, тема, размеры

## Правило 1. Цвета — только из `ThemeStore`

```ts
const COLORS = ThemeStore.useCOLORS()
```

Возвращает светлую или тёмную палитру ([COLORS.ts](../../src/shared/common/config/constants/COLORS.ts)) со структурой `TEXT / BACKGROUND / GLASS / ACCENT / GRADIENT / STATE / HISTORY / AMBIENT / EFFECTS`. Тема берётся из AsyncStorage, при отсутствии — из `Appearance.getColorScheme()`.

❌ Хардкод `'#00C12A'`, `'#fff'`, `'red'` в компонентах.
✅ `COLORS.ACCENT.Primary`, `COLORS.TEXT.Secondary`, `COLORS.GLASS.Border`.

⚠️ Неймспейсов `BRAND`, `SUCCESS`, `ERROR` и `Icon` больше нет — они удалены вместе со старой дизайн-системой. Цвет иконки берётся из `TEXT.*` или `ACCENT.*`, состояния — из `STATE.*`.

Нет подходящего токена — добавляем его в **обе** палитры (`COLORS` и `COLORS_DARK`), а не хардкодим.

## Правило 2. `StyleSheet.create` — внутри тела компонента

Стили зависят от темы, поэтому `StyleSheet.create` вызывается внутри компонента (после `useCOLORS`), а не на уровне модуля. Тяжёлые вычисления стиля оборачиваем в `useMemo` (см. `Typography`).

## Правило 3. Все размеры множим на `SIZES.PX`

```ts
padding: 16 * SIZES.PX,
borderRadius: 16 * SIZES.PX,
width: SIZES.WIDTH(0.5) - 25 * SIZES.PX,
```

`SIZES.PX` — коэффициент плотности от ширины экрана, `SIZES.WIDTH(n)` / `SIZES.HEIGHT(n)` — доли экрана ([sizes.ts](../../src/shared/common/config/constants/sizes.ts)). Голые пиксельные значения без `SIZES.PX` — нарушение.

## Правило 4. Текст — только `Typography`

```tsx
<Typography type="body13" color="secondary" marginsPaddings={{ mt: 12 }}>
    {title}
</Typography>
```

❌ Голый `<Text>` со своими `fontSize`/`fontFamily`. Шрифт (Manrope) и размеры заданы типами `TTypographyTypes`; цвет — `TTypographyColorTypes` (крайний случай — `customColor`).

Проп `type` **обязателен** — дефолта у него нет. Доступные типы — только лестница «21 Век» (см. [design.md](design.md), Правило 2); старая лестница удалена.

## Правило 5. Отступы — `MPLayout` или `marginsPaddings`

Внешние отступы блоков задаются `<MPLayout mt={20} mb={20}>` или пропом `marginsPaddings={{ mt, mb, ph, pv, ... }}` — значения в тех же PX-единицах, `MPLayout` домножает сам.

## Правило 6. SVG — компонентами, цвет через `fill`

`.svg` импортируется как React-компонент (metro + `react-native-svg-transformer`), `#000` подменяется на `props.fill` ([.svgrrc.js](../../.svgrrc.js)):

```tsx
import Icon from '../assets/help.svg'
<Icon fill={COLORS.TEXT.Primary} width={24 * SIZES.PX} height={24 * SIZES.PX} />
```

Если иконка не перекрашивается через `fill`, в проекте держат отдельный `*Dark.svg` и выбирают его по `ThemeStore.useTheme()`.

## Правило 7. Общие элементы — из UI-кита `shared`

Перед тем как верстать своё, проверь `shared/`:

- **Поверхности:** `GlassCard`/`Glass`, `ListRow`/`ListGroup`, `InfoCard`, `PromoRow`, `SectionTitle`
- **Действия:** `PillButton`, `LinkButton`, `Chip`, `PressableScale`, `Switch`
- **Ввод:** `GlassInput`, `GlassSelect`, `AmountField`, `Slider`, `RangePicker`, `WheelPicker`
- **Оболочки:** `CustomModal`, `BottomSheet`, `ConfirmDialog`, `TabBarWithBackground`, `BottomMenu`
- **Состояния:** `CenteredState` (пусто / ошибка / успех), `Skeleton`, `Loader`, `StatusPill`
- **Прочее:** `QrCode`, `DonutChart`, `ProgressRing`, `AnimatedNumber`, `ImageCarousel`, `CameraScanner`, `HtmlContent`, `Icons`

Нажатия оформляем `PressableScale` с масштабом из `PRESS_SCALE.*`, а не голым `TouchableOpacity`. Там, где отклика быть не должно (бэкдроп модалки, перехват тапа), берём `PressableScale` со `scaleTo={1}` — он нужен ради `dismissKeyboard` и `hitSlop`.

⚠️ Удалены и не воскрешаются: `CustomButton`, `CustomInput`, `CustomTouchableOpacity`, `TabBar`, `InfoBlock`, `MapInfoBlocks`, `ErrorGif`, `NewsGif`, `CustomPieChart`. От `CustomSelect` остался только шит с колесом под `GlassSelect`.
