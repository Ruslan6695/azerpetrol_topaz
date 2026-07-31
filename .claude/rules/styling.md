# Стили, тема, размеры

## Правило 1. Цвета — только из `ThemeStore`

```ts
const COLORS = ThemeStore.useCOLORS()
```

Возвращает светлую или тёмную палитру ([COLORS.ts](../../src/shared/common/config/constants/COLORS.ts)) со структурой `BRAND / SUCCESS / ERROR / TEXT / Icon / BACKGROUND`. Тема берётся из AsyncStorage, при отсутствии — из `Appearance.getColorScheme()`.

❌ Хардкод `'#00C12A'`, `'#fff'`, `'red'` в компонентах.
✅ `COLORS.BRAND.Primary`, `COLORS.TEXT.Secondary`, `COLORS.BACKGROUND.Tertiary`.

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
<Typography type="displaySmall" color="secondary" marginsPaddings={{ mt: 12 }}>
    {title}
</Typography>
```

❌ Голый `<Text>` со своими `fontSize`/`fontFamily`. Шрифт (Manrope) и размеры заданы типами `TTypographyTypes`; цвет — `TTypographyColorTypes` (крайний случай — `customColor`).

## Правило 5. Отступы — `MPLayout` или `marginsPaddings`

Внешние отступы блоков задаются `<MPLayout mt={20} mb={20}>` или пропом `marginsPaddings={{ mt, mb, ph, pv, ... }}` — значения в тех же PX-единицах, `MPLayout` домножает сам.

## Правило 6. SVG — компонентами, цвет через `fill`

`.svg` импортируется как React-компонент (metro + `react-native-svg-transformer`), `#000` подменяется на `props.fill` ([.svgrrc.js](../../.svgrrc.js)):

```tsx
import Icon from '../assets/help.svg'
<Icon fill={COLORS.Icon.Primary} width={24 * SIZES.PX} height={24 * SIZES.PX} />
```

Если иконка не перекрашивается через `fill`, в проекте держат отдельный `*Dark.svg` и выбирают его по `ThemeStore.useTheme()`.

## Правило 7. Общие элементы — из UI-кита `shared`

Перед тем как верстать своё, проверь `shared/`: `CustomButton`, `CustomInput`, `CustomSelect`, `CustomModal`, `BottomSheet`, `CustomTouchableOpacity`, `Skeleton`, `Loader`, `QrCode`, `RangePicker`, `ImageCarousel`, `WheelPicker`. Нажатия оформляем `CustomTouchableOpacity`, а не голым `TouchableOpacity`.
