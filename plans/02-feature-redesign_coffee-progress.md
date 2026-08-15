# feature/redesign_coffee — Связанные аккаунты под макет «21 Век»

## Описание задачи

Карточка «Связанные аккаунты» в Профиле была переведена на новый кит ещё в
[profile-settings-redesign-21vek.md](profile-settings-redesign-21vek.md), но два соседних куска того же
сценария остались на старом: экран `/add_join_account` («Пригласить пользователя») и модалка
входящего приглашения `ConfirmAddJoinAccountModal`. Они верстались через `BACKGROUND.Tertiary`,
`CustomInput`, `CustomButton`, `ErrorWhileFetchingForm`, `ProfileImg` и старые типы `Typography`
(`displayMedium`, `bodySmall`) — то есть весь путь «пригласил → принял» выглядел из другого
приложения, чем карточка, из которой он начинается.

Задача — довести сценарий до конца: экран приглашения, модалку входящего приглашения и ревизию
самой карточки. Плюс сопутствующе: фикс показа модалки (она запрашивалась один раз за жизнь
процесса) и неверные тексты ошибок, оставшиеся от копипасты из перевода баланса.

Домен в коде называется **JoinAccount** (не linked/related), маршрут — `ESCREENS.ADD_JOIN_AСCOUNT`
с **кириллической `С` (U+0421)** в имени константы.

Соответствие макету: `showInvite` (строки 430–440 `design/21vek-app.dc.html`), `showInviteSent`
(457–464), `showFuelConfirm` (558–566) как образец шага подтверждения. Модалки входящего
приглашения в макете нет — собрана из принятых примитивов.

---

## Что было сделано

### 1. Экран приглашения: три шага вместо двух

Виджет держал булев флаг `isOnConfirm`. Появился третий шаг — экран «Приглашение отправлено» из
макета, поэтому флаг заменён на явный тип шага:

```ts
// Шаги приглашения: форма → подтверждение найденного пользователя → успех.
export type TAddJoinAccountStep = 'form' | 'confirm' | 'sent'
```

Инфо-карточки теперь рендерятся **только на шаге формы** — раньше `MapInfoBlocks` висел и под
карточкой подтверждения. На шаге `sent` виджет возвращает один `AddJoinAccountSent` без обвязки.

Побочно закрыт давний баг: возврат с шага подтверждения терял набранный номер. Виджет отдаёт его
обратно в форму (`phone={state.phone || params.phone}`).

**Файлы:** `widgets/AddJoinAccountWidget/ui/AddJoinAccountWidget.tsx`,
`widgets/AddJoinAccountWidget/config/types/TAddJoinAccountStep.ts`

---

### 2. Шаг формы — на примитивы нового кита

Ряд `View` + `CustomInput` фиксированной ширины + `CustomTouchableOpacity` с `ContactsIcon`
заменён на вёрстку макета. Взят один в один паттерн соседнего экрана перевода баланса
(`features/TransferBalance/TransferBalanceForm`) — там тот же сценарий «телефон → контакты → отправка».

| Элемент макета | Стало в коде |
|---|---|
| подпись `600 13px --tx2` | `Typography type="body13" color="secondary"` |
| поле телефона 54px r16 с `phone.svg` 20 | `GlassInput` + `icon={<Icon name="phone" size={20} opacity={0.6} />}` |
| стеклянная пилюля 48px «Выбрать из контактов» | `PillButton variant="secondary" size="md"` + `Icon name="person" size={18}` |
| лаймовая «Отправить приглашение» | `PillButton` (дефолтные `primary` / `lg`) |

Пилюля контактов — 46px против 48 в макете: `size="md"` уже есть в ките, отдельный размер ради
2px не заводился (тот же выбор, что в [fuelling-branch-redesign-21vek.md](fuelling-branch-redesign-21vek.md)).

Навигация в контакты и подстановка номера из route-параметров сохранены как были; `openContacts`
обёрнут в `useCallback`.

**Файл:** `features/AddJoinAccount/AddJoinAccountWidget/ui/AddJoinAccountForm.tsx`

---

### 3. Шаг подтверждения — на `CenteredState`

Связка `View` с `BACKGROUND.Tertiary` + два `TransferBalanceConfirmInfoItem` + два `CustomButton`
свёрнута в один готовый примитив, который ровно повторяет `showFuelConfirm` из макета:

```tsx
<CenteredState
    icon={<Icon name="person" size={AVATAR_ICON_SIZE} />}
    title={userName ? `Пригласить ${userName}?` : 'Пригласить пользователя?'}
    description={phone}
    action={{ label: 'Пригласить', variant: 'primary', onPress: handleSubmit, loading: isInviteLoading }}
    secondaryAction={{ label: 'Вернуться назад', onPress: onGoBack }}
/>
```

Ветка ошибки загрузки: легаси `ErrorWhileFetchingForm` + `CustomButton` → `CenteredState variant="error"`.
Ветка загрузки: скелетон переписан под геометрию `CenteredState` — круг 96, заголовок, описание,
две пилюли 54, всё через `shared/Skeleton`.

Успех больше не дёргает `showToast` + `router.navigate(PROFILE)`, а зовёт `onSent()` — шагами
управляет виджет.

Заодно по этому слайсу:
- `errorText: 'Не удалось перевести средства'` → `'Не удалось отправить приглашение'`;
- `isTransferLoading` / `sendTransfer` → `isInviteLoading` / `sendInvite` (копипаста из TransferBalance);
- компонент обёрнут в `memo` — он был единственным в слайсе без него;
- убраны `ThemeStore.useCOLORS()` и локальный `StyleSheet`, ставшие ненужными.

**Файлы:** `features/AddJoinAccount/AddJoinAccountConfirm/ui/AddJoinAccountConfirm.tsx`,
`.../ui/AddJoinAccountConfirmSkeleton.tsx`

---

### 4. Новый слайс `AddJoinAccountSent`

Экран `showInviteSent` из макета, которого в приложении не было — раньше вместо него показывался
тост. Лаймовый круг 96 с «✓», заголовок, тело, стеклянная пилюля «В профиль» — всё это уже умеет
`CenteredState variant="success"`, поэтому слайс тонкий.

Список связанных аккаунтов после возврата обновляется сам: `proccesses/Profile` грузит данные через
`useFocusEffect`.

**Файлы:** `features/AddJoinAccount/AddJoinAccountSent/{index.ts, ui/AddJoinAccountSent.tsx}`

---

### 5. Модалка входящего приглашения

Оболочка оставлена боттом-шитом (в новом дизайне шитов нет, заводить прецедент не стали),
переверстано содержимое. Порядок сверху вниз: грабер 40×4 → круг 96 `GLASS.Secondary` с
`Icon name="person" size={44}` → имя `h6` → телефон `body13` → «Приглашает вас присоединиться к
общему счёту.» `body125` → две подсказки `InfoCard` → **внизу** кнопки.

Ключевое изменение раскладки: кнопки «Принять» / «Отклонить» переехали из шапки шита вниз —
наверху они противоречили порядку во всех переделанных диалогах. Пока идёт один запрос, вторая
кнопка блокируется (`disabled={isAbortLoading}` и наоборот).

`ProfileImg` (SVG-заглушка старого кита) заменён на круг с иконкой и остался без потребителей —
слайс `entities/Profile/ProfileImg` удалён.

**Файл:** `features/AddJoinAccount/ConfirmAddJoinAccountModal/ui/ConfirmAddJoinAccountModal.tsx`

---

### 6. Фикс показа модалки

Компонент смонтирован в `app/_layout.tsx` вне ветки авторизации, а запрос приглашения висел на
`useEffect(..., [])` — то есть уходил **один раз за жизнь процесса**. Пользователь, который логинится
после холодного старта, приглашения в этой сессии не видел до перезапуска приложения.

Эффект завязан на факт авторизации:

```ts
// Именно флаг, а не сам user: объект пересоздаётся при обновлении токена,
// и эффект уходил бы в лишний запрос приглашения.
const isAuthorized = !!UserStore.useUser()
```

При `isAuthorized === false` шит закрывается и запрос не уходит. Флаг, а не сам `user`, — потому что
`setToken` мутирует черновик immer и пересоздаёт объект, что дало бы лишний запрос на каждом
обновлении токена.

Заодно: `errorText` у `abort` был скопирован с `confirm` («Не удалось присоединиться к общему
балансу.») → `'Не удалось отклонить приглашение.'`; в `useCallback` проставлены честные зависимости,
убран неиспользуемый параметр `data` в колбэках.

---

### 7. Ревизия карточки «Связанные аккаунты» в Профиле

Вёрстка совпадала с макетом (строки 253–273), поправлены три вещи:

| Что | Было | Стало |
|---|---|---|
| Порядок плиток | `[...joinAccounts].reverse()` уводил лаймовую плитку владельца счёта в конец ленты | владелец первым, остальные — от последнего добавленного |
| Лента в карточке | горизонтальный `ScrollView` внутри `paddingHorizontal: 18` — плитки подрезались с отступом от края | `marginHorizontal: -18` на скролле + `paddingHorizontal: 18` на контенте, плитки доезжают до края карточки |
| Скелетон | один прямоугольник фиксированной высоты 196 — у пользователя без связанных аккаунтов карточка скачком «схлопывалась» | повтор геометрии: `GlassCard` + заголовок + ряд из двух плиток 100×86 + строка-ссылка |

**Файлы:** `features/Profile/MapProfileJoinAccounts/ui/MapProfileJoinAccounts.tsx`,
`widgets/Profile/ProfileJoinAccountsWidget/ui/ProfileJoinAccountsWidgetSkeleton.tsx`

---

### 8. `shared/BottomSheet` — токены и public API

Правки обратносовместимые, без новых пропсов, поэтому их получили все 4 потребителя
(`PayBalanceSelectBank`, `BuySelectCoffeeModal`, `SelectCoffeeMachineWidget`, `CustomSelectBottomSheet`):

- радиус `SIZES.PX * 40` → `RADII.SHEET * SIZES.PX` (36 из макета);
- бэкдроп `'rgba(0, 0, 0, 0.49)'` → `COLORS.EFFECTS.Backdrop` (был хардкод мимо темы);
- убран теневой модульный импорт `COLORS`, перекрывавшийся хуком `ThemeStore.useCOLORS()`.

Отдельно починен бочонок: `index.ts` делал `export *` над `export default`, из-за чего наружу не
торчало ничего и все потребители импортировали вглубь `BottomSheet/ui/BottomSheet`. Добавлен
именованный реэкспорт по образцу `shared/Skeleton/index.ts`. Новый импорт в модалке идёт уже через
public API; три чужих непеределанных экрана оставлены на старом импорте — это отдельная задача.

**Файлы:** `shared/BottomSheet/ui/BottomSheet.tsx`, `shared/BottomSheet/index.ts`

---

### Прочие изменения

- `ADD_JOIN_ACCOUNT_INFO_TEXTS` и `CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS` переведены с `IInfoBlock[]`
  на `IInfoCard[]` и рендерятся через `entities/InfoCard` (новый кит) вместо `features/MapInfoBlocks`.
  `InfoBlock` / `MapInfoBlocks` не тронуты — их ещё используют `FuelScanBarcodeWidget` и
  `SelectCoffeeMachineWidget`.
- Из `ADD_JOIN_ACCOUNT_INFO_TEXTS` убран мёртвый импорт `CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS`
  (импортировался, но не использовался), в обеих константах исправлена опечатка «последущие».
- `AddJoinAccountScreen` больше не рисует свой `ScreenTitle title="Пригласить пользов."` — заголовок
  приходит из `InternalPagesHeader` по `SCREENS_TITLES`, где лежит полное «Пригласить пользователя».
- По итогам `project-review`: константы виджета переехали из `constants/` в `config/constants/`
  (как у соседнего `TransferBalanceWidget`), экран успеха вынесен из чужого слайса
  `AddJoinAccountConfirm` в собственный.

---

## Расхождения и что осталось

- **Модалки входящего приглашения в макете нет** — раскладка выведена по аналогии с центрированными
  состояниями (`showFuelConfirm`) и переделанными диалогами Профиля. При появлении экрана в макете
  сверить.
- **Ветка «Ваш аккаунт привязан к счёту»** для не-владельца счёта и кнопка «Покинуть группу» —
  расширение макета, оставлены как есть.
- **Экран контактов** (`showPickContact`) в объём не входил.
- `features/AddJoinAccount/AddJoinAccountConfirm/config/IAddJoinAccountGetAccountInfoData.ts` лежит в
  `config/` вместо `config/interfaces/` и не по Prettier — предсуществующее, не трогал.

---

## Проверка

- `npx tsc --noEmit` — **16 ошибок, ровно столько же, сколько до правок**; все предсуществующие
  (`WheelPicker`, `CustomInput`, `RangePicker`, `TabBar`, `CustomSelect`). Новых нет.
- `npx prettier --check` по всем изменённым файлам — чисто.
- Тестов и линтера в проекте нет, на устройстве не запускалось. Требует прогона на dev-билде
  **в обеих темах**: карточка в Профиле (порядок плиток, лента под краем, скелетон), приглашение
  (форма → подтверждение → «Приглашение отправлено» → «В профиль»), входящее приглашение
  (логин на втором аккаунте **после** холодного старта — проверка п. 6).

> Не относится к задаче: в рабочей копии также лежит правка
> `features/Fuel/SelectLiters/ui/SelectLiters.tsx` (снят `max` у ручного ввода литров и суммы) —
> сделана вне этой работы, в отчёт не включена.
