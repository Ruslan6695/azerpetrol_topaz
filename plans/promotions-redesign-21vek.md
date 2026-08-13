# Передизайн акций под макет «21 Век»

## Зачем

Раздел акций остался последним куском старой дизайн-системы: акции на главной уже переделаны прошлой волной ([home-redesign-21vek.md](home-redesign-21vek.md)) — там `HomePromotionCard` с картинкой-скримом и лаймовой строкой `PromoRow`, — а экран `/bonuses` и деталь `/bonuses/details` жили в прежнем виде:

- **Список `/bonuses`** — `PromotionsAndBonusesItem` рисовал голую `Image` высотой 155 с `borderRadius: 20 * SIZES.PX` мимо `RADII`, без заголовка акции, без отклика на нажатие. Плюс виджет печатал свой `ScreenTitle` «Акции и бонусы», хотя шапка экрана уже показывает «Акции и Бонусы» — заголовок на экране двоился.
- **Деталь `/bonuses/details`** — `html_text` через голый `RenderHTML` с ручной развилкой цвета `theme === DARK ? 'white' : undefined` мимо палитры: не работали картинки, видео и встроенные плееры внутри текста акции.
- **Ветка `page_link`** — WebView на весь экран без шапки: выйти можно было только свайпом или если сама страница пришлёт `postMessage('goBack')`. На Android, где системного свайпа назад может не быть, это тупик.

Экрана акций в макете ([`design/21vek-app.dc.html`](../design/21vek-app.dc.html)) **нет** — как и детали новости. Собран из соседних паттернов: блок акций главной для списка, деталь новости для текстовой детали.

**Бэкенд не менялся:** `GET promotions/ {token}` → `{ promotions: [{ id, img, html_text, date_create, header, page_link, show_main, show_modal, view_type?, label?, icon? }] }`.

---

## Решения, принятые до кода

| Вопрос | Решение |
|---|---|
| Вид карточки в списке | **Как на главной** — переиспользуем `HomePromotionCard`, он сам выбирает вид по `view_type` (картинка со скримом либо лаймовая строка). Новых компонентов не заводим |
| Что показывать на детали без `page_link` | Дата → заголовок → **картинка-герой** → `html_text` в стеклянной карточке. Картинку оставили: у акции она часто и есть само предложение |
| Ветка `page_link` | Над WebView появляется шапка с кнопкой «назад» — гарантированный выход независимо от того, умеет ли страница `goBack` |
| Пустое состояние и ошибка загрузки | **Не трогаем** в этой волне: `WithoutPromotionsAndBonusesBlock` остаётся на гифке `NewsGif`, `ErrorWhileFetchingForm` — с прежним `mt: 100` |
| Отдельный `PromotionCardSkeleton` | Не заводим. Правим числа у существующего `Skeleton` в виджете |

---

## Что сделано

### 1. Карточка списка — [PromotionsAndBonusesItem.tsx](../src/entities/PromotionsAndBonuses/PromotionsAndBonusesItem/ui/PromotionsAndBonusesItem.tsx)

Своя вёрстка (`View` + `Image` + `StyleSheet`) убрана целиком. Компонент сохранил публичный API (`<PromotionsAndBonusesItem {...pr} />`) и свой переход в деталь, а рисует теперь соседа по слайсу — [HomePromotionCard](../src/entities/PromotionsAndBonuses/PromotionsAndBonusesItem/ui/HomePromotionCard.tsx), которому передаёт `onPress`. Файл ужался с 43 строк до 23.

Из этого следует: акция с `img` (или `view_type: 'image'`) — это `PromotionImageCard`, фото r24 высотой 150 с тёмным скримом, лаймовым надстрочником `label` и заголовком `num18` поверх; акция без картинки — лаймовая строка `PromoRow` с иконкой по полю `icon`. Нажатие даёт `PRESS_SCALE.CARD`.

**Побочный эффект, осознанный.** Тот же компонент рисуется внутри [ImageCarousel](../src/shared/ImageCarousel/ui/ImageCarousel.tsx) в стартовой модалке акций ([ShowPromotionsModal](../src/features/ShowPromotionsModal/ui/ShowPromotionsModal.tsx)) — она тоже получила новый вид карточки, и это желаемо: модалка отставала от главной. Высота слайда карусели 160 против 150 у карточки — на устройстве проверить, что запаса хватает и ничего не обрезано.

### 2. Виджет списка — [PromotionsAndBonusesWidget.tsx](../src/widgets/PromotionsAndBonusesWidget/ui/PromotionsAndBonusesWidget.tsx)

- `ScreenTitle` и его импорт убраны — заголовок даёт `InternalPagesHeader` через `SCREENS_TITLES`. На месте остался комментарий, чтобы заголовок не вернули обратно.
- Зазор между карточками `SIZES.PX * 10` → `SPACING.MD * SIZES.PX` (12), как в списке новостей.
- Скелетон: высота 155 → 150 (ровно `PromotionImageCard`) и `borderRadius: RADII.CARD * SIZES.PX` — иначе при догрузке карточка прыгала из r16 в r24.
- `StyleSheet.create` уехал внутрь компонента под `useMemo` (правило 2 [styling.md](../.claude/rules/styling.md)) — раньше лежал на уровне модуля.
- Импорт `Skeleton` переведён с глубокого пути `shared/Skeleton/ui/Skeletons` на public API `shared/Skeleton` (правило 2 [imports.md](../.claude/rules/imports.md)).

### 3. Деталь — [PromotionsAndBonusesDetailsWidget.tsx](../src/widgets/PromotionsAndBonusesDetailsWidget/ui/PromotionsAndBonusesDetailsWidget.tsx)

Переписан по образцу [NewsDetailsWidget](../src/widgets/News/NewsDetailsWidget/ui/NewsDetailsWidget.tsx).

**Ветка без `page_link`:**

- дата через `formatNewsDate(params.date_create)` → `caption12 color="secondary"`;
- заголовок `num20` с отступом `SPACING.XS`;
- картинка-герой: `Image` высотой 180 в контейнере `RADII.CARD` c `overflow: 'hidden'`, `resizeMode="contain"` — баннеры акций часто целиком текстовые, кадрировать их нельзя. Блок рендерится только при непустом `img`;
- `html_text` → `<HtmlContent />` внутри `GlassCard variant="glass2" radius={RADII.CARD} padding={18}`. `RenderHTML`, `EColorThemes` и хардкод `'white'` ушли: тему документа собирает `buildHtmlDocument` внутри обёртки, а вместе с ней заработали картинки, видео и iframe-плееры внутри текста акции — ровно как в новостях.

**Ветка `page_link`:**

- своя шапка — круглая `Glass level="secondary"` со стрелкой `←` в `PressableScale` (`PRESS_SCALE.BACK`) плюс `num18` с заголовком из `SCREENS_TITLES`. Вёрстка та же, что в `InternalPagesHeader` и `NewsDetailsWidget`; верхний отступ — `useSafeAreaInsets().top`, горизонтальный — `SPACING.SCREEN` (экран идёт с `disablePaddings`);
- высота шапки замеряется через `onLayout`, WebView получает `SIZES.HEIGHT(1) - headerHeight`. Так не приходится вычитать magic numbers чужого компонента: изменится хедер — высота пересчитается сама;
- **в ссылку рядом с токеном уходит тема приложения**: `…?token=<token>&theme=dark|light` — чтобы страница на бэке подогнала свой дизайн под приложение. Значение берётся из `ThemeStore.useTheme()` (енам `EColorThemes`, строки `'dark'`/`'light'`). Разделитель считается по строке: если в `page_link` с бэка уже есть свой query, добавляется `&`, а не второй `?` — раньше параметр приклеивался через `?` вслепую. Ссылка собирается в `useMemo` (`pageUri`);
- WebView монтируется только когда собрана ссылка (`!!pageUri`), то есть после чтения токена, а не подменяет собой текстовую ветку на время чтения `AsyncStorage`, как было раньше;
- `onMessage` с `'goBack'` сохранён — страницы, которые уже умеют закрываться сами, продолжают работать.

Чтение токена теперь запускается только для этой ветки (`useEffect` под `isExternalPage`) — текстовой детали токен не нужен.

### 4. Стартовая модалка акций — [ImageCarousel.tsx](../src/shared/ImageCarousel/ui/ImageCarousel.tsx)

Показ акций с `show_modal: true` при входе в приложение **уже был реализован** и работает: [ShowMainPromotions](../src/features/Home/ShowMainPromotions/ui/ShowMainPromotions.tsx) по `isTokenRefreshed` грузит `promotions/`, отбирает `show_modal === true` и кладёт в `ShowPromotionsModalStore` → [ShowPromotionsModal](../src/features/ShowPromotionsModal/ui/ShowPromotionsModal.tsx) открывает `CustomModal` с каруселью, смонтирован в `HomeMainWidget`. Флаг `isOpened` держится в памяти стора, поэтому модалка показывается **один раз за запуск** приложения. Логику не меняли.

Переделана только сама карусель — она осталась на старых токенах, а карточки внутри неё теперь новые (п. 1):

- радиус `25 * SIZES.PX` → `RADII.CARD`, высота слайда 160 → 150, ровно под `PromotionImageCard`;
- точки пагинации: неактивная — `COLORS.GLASS.Border` размером 6 с `RADII.PILL` (раньше `COLORS.TEXT.Tertiary` и `borderRadius: '50%'` строкой), активная — `COLORS.ACCENT.Lime` вместо `COLORS.BRAND.Secondary`; зазор и отступ — из `SPACING`;
- **одна акция больше не притворяется слайдером**: при `promotions.length <= 1` выключены автопрокрутка (`autoPlay`), жесты (`enabled`) и скрыт ряд точек. Раньше единственная акция бесконечно «прокручивалась» сама в себя раз в 5 секунд под одной точкой;
- вычищены мёртвые импорты (`Dimensions`, `Image`, `StyleSheet`, `Text`, `View`, `EColorThemes`), неиспользуемая константа `width` и неиспользуемый `ThemeStore.useTheme()`.

Пропы `autoPlay`/`enabled` сверены с типами установленной `react-native-reanimated-carousel@^4.0.2` (`node_modules/.../types.d.ts`), а не по памяти.

### 5. Экран — [PromotionsAndBonusesDetailsScreen.tsx](../src/screens/PromotionsAndBonusesDetailsScreen/ui/PromotionsAndBonusesDetailsScreen.tsx)

Логика `hideHeader`/`hideScroll`/`disablePaddings` при `page_link` не менялась: шапку для этой ветки рисует сам виджет — иначе получилась бы вторая шапка поверх layout'а и пришлось бы считать доступную высоту чужого компонента. Убран мёртвый `StyleSheet.create({ container: {} })` и лишние импорты.

---

## Проверка

- `npx tsc --noEmit` — **22 ошибки, столько же, сколько до правок** (замерено откатом изменённых файлов через `git stash`), ни одной в изменённых файлах. Оставшаяся ошибка в разделе акций предсуществующая: `TPromotionsAndBonusesScreenParams` не удовлетворяет ограничению `Route` в `useLocalSearchParams` — не трогали.
- `npx prettier --check` по всем изменённым файлам — чисто.
- Пересборка dev-билда **не требуется**: новых нативных модулей нет, `react-native-webview` уже стоит и используется новостями.

**На устройстве не проверялось** — нужен прогон на dev-билде:

1. `/bonuses` — акция с картинкой, акция без картинки (лаймовая строка), скелетоны при загрузке, пустой список, обрыв сети;
2. акция без `page_link` — дата, заголовок, картинка, текст с картинками/видео внутри `html_text`, ссылки уходят во внешний браузер;
3. акция с `page_link` — страница под шапкой, «назад» возвращает в список, в адресе есть `theme`; переключение темы в Профиле и возврат на акцию — страница открывается с новым значением;
4. стартовая модалка акций (`show_modal`) — открывается один раз за запуск; с несколькими акциями листается и показывает точки, с одной — без автопрокрутки и без точек; карточки не обрезаны;
5. обе темы через переключатель в Профиле.

---

## Расхождения с макетом и долг

- **Экрана акций в макете нет** — вёрстка реконструирована из блока акций главной и детали новости. Если дизайнер нарисует раздел, эталон — макет, а не этот экран.
- `view_type`, `label`, `icon` бэкенд пока не отдаёт: вид карточки определяется фолбэком «есть `img` → картинка, иначе строка», надстрочник у строки — «Акция», иконка — процент. Это описано в [IPromotionsAndBonusesItem.ts](../src/entities/PromotionsAndBonuses/PromotionsAndBonusesItem/config/interfaces/IPromotionsAndBonusesItem.ts) и не менялось.
- Пустое состояние акций осталось на гифке `NewsGif`, тогда как у новостей уже `CenteredState`. Сознательно вынесено за рамки волны.
- `ErrorWhileFetchingForm` вызывается с `margins={{ mt: 100 }}` — на экране новостей от этого отступа уже отказались.
- Заголовок модалки акций (`CustomModal title="Акции"`) печатается старым типом `bodyAccentSmall`: тип задан внутри `CustomModal`, у которого 8 мест вызова, — перевод шапки модалок на новую лестницу это отдельная задача по всему UI-киту.
