# feature/pay_balance_redesign — Редизайн пополнения баланса и экрана успеха под макет «21 Век»

## Описание задачи

Экран пополнения баланса оставался на старом дизайне, пока главная и авторизация уже переехали на «21 Век»: заголовок-дубликат, `CustomInput` с плейсхолдером, `CustomButton`, WebView СБП в жёсткой рамке 90%×70% и Lottie-ожидание с капсовыми надписями. Нужно было привести весь сценарий пополнения к макету.

В макете (`design/21vek-app.dc.html`, строки 328–343, флаг `showPay`) нарисован только первый шаг — карточка суммы с чипами и кнопка «Перейти к оплате», ведущая сразу на «Успешно». Реального трёхшагового флоу СБП (сумма → выбор банка → ожидание зачисления) в прототипе нет, поэтому шаги 2–3 достроены языком макета: боттом-шит и `CenteredState`.

По ходу работы вскрылись и были починены две проблемы за пределами экрана: шапка `InternalPagesLayout` уезжала под Dynamic Island на всех корневых маршрутах, а экран успеха (`ESCREENS.SUCCESS`) целиком оставался в старом дизайне и расходился с макетом.

Бэкенд не менялся: `GET balance_pay/ {token, sum}` → `{link, id}` и `GET balance/pay_success/ {token, pay_id}` → `{status}` работают как прежде.

---

## Что было сделано

### 1. Новый примитив `shared/AmountField`

Бокса с крупным числом в акцентной рамке в UI-ките не было: у `GlassInput` рамка `GLASS.Border`, фиксированная высота и текст 15px. При этом ровно такой бокс уже был свёрстан по месту в `ConvertBonusModal` — то есть примитив требовался во второй раз и по правилам архитектуры уезжает в `shared/`.

```ts
type Props = {
    value: number
    onChangeValue: (value: number) => void
    suffix?: string          // '₽' по умолчанию
    align?: 'left' | 'center'   // 'left' → alignSelf: 'flex-start' вместо width: fit-content
    fontSize?: number        // 34 — в лестнице Typography нет 800/34
    radius?: number          // RADII.INPUT
    minWidth?: number        // 130
    min?: number             // 0
    max?: number
    style?: StyleProp<ViewStyle>
}
```

Вёрстка по строке 332 макета: фон `COLORS.GLASS.Primary`, `borderWidth: 1.5 * SIZES.PX` цветом `COLORS.ACCENT.Primary`, `borderRadius: RADII.INPUT * SIZES.PX`, паддинги `SPACING.SM` / `SPACING.LG`. Число — `TextInput` с `FONTS.EXTRABOLD` и `keyboardType="number-pad"`, суффикс — `Typography type="num18" color="secondary"`.

Из ввода вырезается всё, кроме цифр (`parseInt(text.replace(/\D/g, ''), 10)`), результат зажимается в `[min, max]` — иначе в запрос уйдёт сумма, которую бэкенд не примет.

Вместо `align-items: baseline` из макета используется `flex-end`: baseline в RN ведёт себя по-разному на iOS и Android.

**Файлы:** `src/shared/AmountField/ui/AmountField.tsx`, `src/shared/AmountField/index.ts`

---

### 2. Новая entity `entities/InfoCard`

Существующий `InfoBlock` — старый дизайн (`Typography` без типа + `type="caption"`, жёсткая ширина `SIZES.WIDTH(1) - 40`) и используется ещё в 10 непеределанных виджетах, поэтому трогать его нельзя. Заведена параллельная entity нового дизайна, на неё экраны будут переезжать по мере редизайна.

```ts
export interface IInfoCard {
    title: string
    info: string
}
```

Рендер: `<GlassCard radius={RADII.CARD} padding={SPACING.XL}>` → `Typography type="label14"` + `Typography type="body13" color="secondary"` с `mt: 4`. Ширина не задаётся — карточка тянется по контейнеру.

**Файлы:** `src/entities/InfoCard/ui/InfoCard.tsx`, `src/entities/InfoCard/config/interfaces/IInfoCard.ts`, `src/entities/InfoCard/index.ts`

---

### 3. Форма суммы — `features/PayBalance/PayBalanceForm`

Переписана целиком под карточку из макета:

- `<GlassCard variant="glass2" radius={RADII.HERO_SM} paddingTop={22} paddingHorizontal={SPACING.SCREEN} paddingBottom={18}>` — та же геометрия, что у `BalanceCard` на главной;
- `Typography type="eyebrow"` «Сумма пополнения» (uppercase, `letterSpacing` и secondary уже внутри токена);
- `AmountField` с суффиксом «₽»;
- ряд чипов быстрых сумм: `flexWrap`, `gap: SPACING.SM`, `marginTop: SPACING.LG`, каждый — `<Chip label={divideNumber(sum)} selected={amount === sum} />`;
- `<PillButton title="Перейти к оплате" loading={isSendFetchLoading} disabled={amount <= 0} />`.

Состояние переехало с `useInput` на `useState<number>`: значение числовое. Проверка «Введите сумму» через `showError` убрана — кнопка задизейблена при `amount <= 0`. Отдельный `Loader` вместо контента больше не показывается, за загрузку отвечает проп `loading` у `PillButton`. Мёртвые импорты `SumIcon` и `SIZES` удалены.

Быстрые суммы и дефолт вынесены в константы:

```ts
// config/constants/QUICK_SUMS.ts
export const QUICK_SUMS = [500, 1000, 2000, 5000]

// config/constants/DEFAULT_PAY_SUM.ts
export const DEFAULT_PAY_SUM = 1000
```

Если экран открыт с параметром `sum` (нехватка средств при наливе из `SelectLiters`), он перебивает дефолт.

Атрибуты `min="50" max="50000" step="100"` из HTML-прототипа не переносились — это свойства макета, а не контракт бэкенда.

**Файлы:** `src/features/PayBalance/PayBalanceForm/ui/PayBalanceForm.tsx`, `src/features/PayBalance/PayBalanceForm/config/constants/QUICK_SUMS.ts`, `src/features/PayBalance/PayBalanceForm/config/constants/DEFAULT_PAY_SUM.ts`

---

### 4. Выбор банка — боттом-шит вместо врезки

Раньше WebView со страницей СБП рендерился прямо в потоке экрана в `View` размером `SIZES.HEIGHT(0.7) × SIZES.WIDTH(0.9)`. Теперь это шит на 90% высоты поверх формы.

Изменённая сигнатура:

```ts
type Props = {
    link: string
    isOpened: boolean
    onSelectBank: () => void
    onClose: () => void
}
```

Состав: `BottomSheet` (самописный, на RN `Modal`) с `bgDark` и `closeOnPressOutside`, внутри — шапка с `Typography type="num18"` «Выберите банк» и круглой кнопкой-крестиком 38×38 (`Glass level="secondary"` + `PressableScale` с `PRESS_SCALE.BACK`, как в `InternalPagesHeader`), ниже — `WebView` во `flex: 1` со `startInLoadingState` и `renderLoading` поверх `COLORS.GLASS.Surface`.

Логика выбора банка не менялась: `onMessage` → `Linking.openURL(диплинк)` → `onSelectBank()`, при отсутствии приложения банка — тост «Приложение банка не установлено». Обработчик заодно типизирован `WebViewMessageEvent` вместо `any`.

Пустая ссылка теперь отдаёт `CenteredState variant="error"` вместо старого `ErrorWhileFetchingForm`.

**Файл:** `src/features/PayBalance/PayBalanceSelectBank/ui/PayBalanceSelectBank.tsx`

---

### 5. Ожидание оплаты — `CenteredState` вместо Lottie

Экран ожидания был центрированным столбиком с Lottie-анимацией 200×300, двумя капсовыми надписями («НЕМНОГО ПОДОЖДИТЕ», «ДЕНЬГИ ПОСТУПЯТ АВТОМАТИЧЕСКИ»), кнопкой 300px и нерабочей кнопкой «ПОМОЩЬ» с `onPress={() => {}}`.

Стало два состояния на общем примитиве:

| Состояние | Компонент |
|-----------|-----------|
| Ожидание | `CenteredState` с `icon={<Loader />}`, «Ожидаем оплату» / «Подтвердите платёж в приложении банка — средства поступят автоматически», кнопка «Вернуться к выбору банка» |
| Ошибка | `CenteredState variant="error"`, «Не удалось проверить оплату», `description={errorText}`, кнопка «На главную» |

Нерабочая кнопка «ПОМОЩЬ» удалена.

Поллинг статуса сохранён дословно: `setInterval` 1 c, `hideToastOnError`, `leaveErrorBeforeLoading`, `clearInterval` при успехе и в cleanup. Изменился только переход на успех — параметр `text` больше не передаётся, чтобы на экране успеха подставился макетный текст:

```ts
router.navigate({
    pathname: ESCREENS.SUCCESS,
    params: { link: backLink },
})
```

`CenteredState` растягивается по `flex`, а экран стал скроллящимся, поэтому обёрнут в контейнер с `minHeight: SIZES.HEIGHT(0.65)` — иначе состояние схлопнулось бы к шапке.

**Файл:** `src/features/PayBalance/PayBalanceWaiting/ui/PayBalanceWaiting.tsx`

---

### 6. Удаление Lottie-анимации

Вместе с переходом на `CenteredState` удалена entity целиком — единственным её потребителем был экран ожидания.

**Удалено:** `src/entities/PayBalanceWaitingGif/ui/PayBalanceWaitingGif.tsx`, `src/entities/PayBalanceWaitingGif/index.ts`, `src/entities/PayBalanceWaitingGif/assets/payment.json`

---

### 7. Виджет пополнения — новый флоу и починенный баг

Раньше шаг экрана хранился в одном состоянии `useState<'changeSum' | 'selectBank' | 'waiting'>('waiting')`. **Начальное значение было `'waiting'`** — форма показывалась только потому, что `orderData` пуст и ветка не проходила проверку.

Теперь состояние разведено на два независимых:

```ts
const [step, setStep] = useState<'form' | 'waiting'>('form')
const [isBankOpened, setIsBankOpened] = useState(false)
const [orderData, setOrderData] = useState<IPayBalanceFormData>()
```

Переходы:

| Событие | Что происходит |
|---------|----------------|
| Форма отправлена | `setOrderData(data)` + открывается шит выбора банка |
| Банк выбран | шит закрывается, `step = 'waiting'` |
| «Вернуться к выбору банка» | шит открывается снова, форма не перерисовывается |

Прочее в виджете:
- убран `<ScreenTitle title="Пополните баланс" />` — дублировал заголовок «Пополнение баланса», который рисует `InternalPagesHeader` из `SCREENS_TITLES`;
- четыре информационных блока переехали с `MapInfoBlocks` + `InfoBlock` на прямой `map` по `InfoCard` в контейнере с `gap: SPACING.MD` и `marginTop: SPACING.SECTION`;
- шит выбора банка вынесен из условного рендера — он смонтирован всегда и управляется пропом `isOpened`;
- удалён мёртвый `styles.container = {}`;
- `PAY_BALANCE_INFO_TEXTS` перетипизирован с `IInfoBlock` на `IInfoCard`, тексты не менялись.

**Файлы:** `src/widgets/PayBalanceWidget/ui/PayBalanceWidget.tsx`, `src/widgets/PayBalanceWidget/constants/PAY_BALANCE_INFO_TEXTS.ts`

---

### 8. Экран и роут

С `InternalPagesLayout` снят `hideScroll`: с четырьмя информационными карточками контент перестал помещаться на экран. Отдельная обработка клавиатуры не понадобилась — layout уже построен на `KeyboardAwareScrollView` с `enableOnAndroid` и `keyboardShouldPersistTaps="handled"`.

Из файла роута удалён неиспользуемый импорт `InternalPagesLayout`.

**Файлы:** `src/screens/PayBalanceScreen/ui/PayBalanceScreen.tsx`, `src/app/pay_balance/index.tsx`

---

### 9. Шапка внутренних страниц под вырезом экрана

Обнаружено при проверке на устройстве: заголовок и кнопка «назад» уезжали под Dynamic Island.

Причина не в экране пополнения. В корневом `_layout.tsx` глобально стоит `<StatusBar hidden />`, вкладки в группе `(main)` обёрнуты в `SafeAreaView edges={['top','right','left']}`, а `InternalPagesLayout` оказался единственной обвязкой вообще без safe-area — то есть под вырез уезжали все корневые маршруты: `pay_balance`, `history`, `contacts`, `settings`, `about_app` и ещё около десятка.

Исправлено централизованно в шапке, единственный потребитель которой — `InternalPagesLayout`:

```ts
const insets = useSafeAreaInsets()
// ...
paddingTop: insets.top + 10 * SIZES.PX,
```

Отступ поставлен именно на шапку, а не на контейнер layout: `AmbientBackground` позиционируется абсолютно и при паддинге на родителе съехал бы вниз вместе с контентом.

**Файл:** `src/widgets/InternalPagesHeader/ui/InternalPagesHeader.tsx`

---

### 10. Экран успеха — переезд на `CenteredState`

`SuccessWidget` оставался полностью в старом дизайне: SVG `SuccessImage` с белой галочкой, `Typography type="headlineSmall" color="success"` с `.toUpperCase()`, две reanimated-анимации въезда слева и справа, авто-возврат через `setTimeout` без очистки и никакой кнопки.

Переписан на `CenteredState variant="success"` по макету (строки 645–651):

| Что | Стало |
|-----|-------|
| Иконка | лаймовый круг 96 с глифом «✓» цветом `COLORS.ACCENT.OnLime` |
| Заголовок | «Готово!» |
| Описание | `params.text` или дефолт «Операция выполнена успешно. Баланс обновится в течение минуты.» |
| Кнопка | «На главную», либо «Продолжить», если возврат идёт не на главную (например на топливо) |
| Заголовок шапки | добавлен `[ESCREENS.SUCCESS]: 'Успешно'` в `SCREENS_TITLES` — раньше ключа не было и шапка была пустой |

Авто-возврат через 3 секунды убран: в макете его нет, а с явной кнопкой он мешал бы дочитать текст. Анимации въезда тоже убраны — переход между экранами анимирует expo-router.

**Файлы:** `src/widgets/SuccessWidget/ui/SuccessWidget.tsx`, `src/shared/common/config/constants/SCREENS_TITLES.ts`

---

### 11. Приведение `CenteredState` к макету

Примитив создавался как код-версия центрированного состояния из макета, но разошёлся с ним в трёх местах. Правки сделаны в самом `shared`, а не по месту:

| Что | Было | Стало | По макету |
|-----|------|-------|-----------|
| Заголовок | `Typography type="h6"` (800/22) | `type="h5"` (800/24) | `font: 800 24px` |
| Глиф в круге | `type="h5"` (24px) | `type="h1"` (40px) | `font: 800 44px` — ближайший токен 40 |
| Кнопки | `alignSelf: 'stretch'` + `paddingHorizontal: 40` | `fullWidth={false}`, `alignSelf: 'center'` | пилюля `padding: 0 32px` по ширине контента |

Изменение затрагивает и состояния ошибок в `SendCallcheckWait` — там кнопки «Попробовать ещё раз» и fallback тоже станут узкими по контенту.

**Файл:** `src/shared/CenteredState/ui/CenteredState.tsx`

---

## Осознанные отклонения от макета

| Что | Почему |
|-----|--------|
| Число суммы — сырой `fontSize: 34`, а не токен `Typography` | В лестнице нет 800/34 (соседи `h2` 32 и `h1` 40). Значение заперто внутри одного shared-примитива, как 30px в `ConvertBonusModal` |
| Суффикс «₽» — `num18` (800/18) вместо 700/18 макета | Веса 700 на 18px в лестнице нет, расхождение на суффиксе незаметно |
| Глиф «✓» — 40px вместо 44px | Нет токена 800/44 |
| У выбранного (лаймового) чипа нет рамки | Так устроен примитив `Chip` (`borderWidth: isLime ? 0 : 1`), проп ради 1px контура поверх лайма не заводился |
| Шаги «выбор банка» и «ожидание» | В макете отсутствуют — прототип ведёт с кнопки прямо на «Успешно». Реальный флоу СБП сохранён и оформлен языком макета |
| `min/max/step` из HTML не перенесены | Атрибуты прототипа, а не контракт бэкенда |
| Импорт вглубь `shared/BottomSheet/ui/BottomSheet` | У компонента default-экспорт, который `index.ts` наружу не пробрасывает; так его импортируют все текущие потребители |

---

## Тесты

Тестов и линтера в проекте нет. Проверка — типами: `npx tsc --noEmit` даёт **29 ошибок и до, и после** изменений, набор ошибок посимвольно совпадает с базовой линией (сравнение отсортированных выводов). Единственная ошибка в затронутых файлах — предсуществующая `TS2345` в `SuccessWidget` про типы маршрутов `typedRoutes`.

Грепом проверено, что после удаления entity не осталось ссылок на `PayBalanceWaitingGif` и `payment.json`, а `MapInfoBlocks` продолжает использоваться десятью другими виджетами.

**Проверка на устройстве не проводилась** — нужен dev-билд (`yarn ios` / `yarn android`), в Expo Go проект не запускается. Проверить стоит: шит с WebView и возврат из приложения банка, ввод суммы и подсветку чипов, скролл до последней карточки, светлую тему, а также остальные корневые экраны после правки отступа шапки (History, Contacts, Settings).

---

## Прочие изменения

- `IPayBalanceFormData.ts` — форматирование prettier (`id:number` → `id: number`).
- `src/widgets/InternalPagesHeader/index.ts`, `src/widgets/SuccessWidget/index.ts` — prettier дописал перевод строки в конце файла.

---

## Что осталось за рамками

- Миграция `ConvertBonusModal` на новый `AmountField` — один файл, снимает дублирование, но трогает главную.
- Перевод остальных 10 экранов с `InfoBlock` на `InfoCard`.
- `RADII.SHEET` (36) вместо захардкоженного радиуса 40 в `BottomSheet` — у компонента шесть потребителей.
- Кнопка «назад» на экране успеха возвращает в форму пополнения: `success` кладётся поверх неё в стек. Правильнее `replace`, но это меняет навигацию во всех сценариях (пополнение, перевод).
