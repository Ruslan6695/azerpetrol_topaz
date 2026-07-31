# Архитектура — Feature-Sliced Design

Проект построен по **Feature-Sliced Design**. Это не пожелание, а действующая структура: любой новый код кладётся в существующий слой по правилам ниже. Никакой другой архитектуры (MVC, «папка components», группировка по типам файлов) в `src/` быть не должно.

Слои в [src/](../../src/). Каждый слой импортирует **только из слоёв ниже себя**:

```
app/         роуты expo-router (тонкие: рендерят Screen и всё)
screens/     обёртка в одну строку над процессом
proccesses/  композиция страницы (папка реально называется с опечаткой — так и пишем)
widgets/     самодостаточные блоки со своим api/ и model/ (store)
features/    одно пользовательское действие (форма, кнопка-переход, модалка)
entities/    презентационные куски домена (элементы списка, инфо-блоки)
shared/      UI-кит, глобальные стора, axios-инстанс, хуки, константы
layouts/     обвязка экрана (InternalPagesLayout, LoginRegistrationLayout)
```

Типовая цепочка: `app/(main)/home` → `screens/HomeScreen` → `proccesses/Home` → `widgets/Home/HomeMainWidget` → `features/Home/*` + `entities/HomeMainBlock` → `shared/*`.

## Отклонения от канонического FSD — так задумано, не чинить

Структура отличается от эталонной методологии. Это осознанные решения проекта, приводить их «к канону» без отдельной задачи нельзя — сломаются сотни импортов:

| В проекте | В каноническом FSD | Комментарий |
|-----------|--------------------|-------------|
| `proccesses/` | слой `processes` был убран из FSD 2.0 | Здесь он живой и занят композицией страницы. Пишется с двумя `c` — это опечатка в имени папки, но она закреплена |
| `app/` + `screens/` + `proccesses/` | один слой `pages` | Разделение навязано expo-router: `app/` — файловый роутинг, `screens/` — обёртка, `proccesses/` — сама композиция |
| `layouts/` | своего слоя нет | Обвязка экранов вынесена отдельно |
| `shared/Xxx/` рядом с `shared/common/` | `shared/ui`, `shared/lib`, `shared/api` | UI-кит лежит папками в корне `shared/`, а невизуальное — в `shared/common/` |
| Импорт через относительные пути | алиасы `@/features/...` | Алиасов в проекте нет, см. [imports.md](imports.md) |

## Матрица импортов

Кто кого может импортировать (✅ можно, ❌ нельзя):

| из ↓ / в → | app | screens | proccesses | widgets | features | entities | layouts | shared |
|------------|-----|---------|------------|---------|----------|----------|---------|--------|
| app        | ❌  | ✅      | ✅         | ✅      | ✅       | ✅       | ✅      | ✅     |
| screens    | ❌  | ❌      | ✅         | ✅      | ✅       | ✅       | ✅      | ✅     |
| proccesses | ❌  | ❌      | ❌         | ✅      | ✅       | ✅       | ✅      | ✅     |
| layouts    | ❌  | ❌      | ❌         | ✅      | ✅       | ✅       | ❌      | ✅     |
| widgets    | ❌  | ❌      | ❌         | ❌      | ✅       | ✅       | ⚠️      | ✅     |
| features   | ❌  | ❌      | ❌         | ❌      | ❌       | ✅       | ❌      | ✅     |
| entities   | ❌  | ❌      | ❌         | ❌      | ❌       | ❌       | ❌      | ✅     |
| shared     | ❌  | ❌      | ❌         | ❌      | ❌       | ❌       | ❌      | ✅     |

Импорты «вбок» (feature из feature, widget из widget) запрещены: общее выносится вниз — в `entities/` или `shared/`. Единственное исключение — `ESCREENS` и типы параметров маршрутов, они лежат в `shared/` и доступны всем.

Боковых импортов в коде нет ни одного — матрица соблюдается. Известные исключения, это долг, а не образец:

**⚠️ `widgets` → `layouts` — цикл между слоями.** `layouts/InternalPagesLayout` импортирует `widgets/InternalPagesHeader` и `widgets/CheckNetworkWidget`, а обратно три виджета тянут layout: `LoginWidget`, `RegistrationWidget` (оба → `LoginRegistrationLayout`), `HistoryWidget` (→ `InternalPagesLayout`). **Правильное место применения layout — слой `screens`** (так сделано в 19 экранах из 23). Новые виджеты layout не импортируют — его надевает экран.

**Импорты «снизу вверх» из `shared`** — ровно два файла:
- `shared/ImageCarousel/ui/ImageCarousel.tsx` → `entities/PromotionsAndBonuses/PromotionsAndBonusesItem` и `features/ShowPromotionsModal/.../IShowPromotionsModalData`
- `shared/CameraScanner/ui/CameraScannerHasNotPermissions.tsx` → `entities/ErrorWhileFetchingForm`

Новые такие импорты не добавляем. Чинить существующие — отдельной задачей (карусель параметризуется через `renderItem`, тип переезжает в `shared`), походя в чужом изменении не трогаем.

## Правило 1. Слой определяется ответственностью, а не размером

- **Есть действие пользователя** (открыть модалку, отправить запрос, запустить сценарий, перейти на экран по кнопке) → `features/`. Именно поэтому в проекте есть `features/Home/OpenFuelScreen`, `OpenPayBalanceScreen` и т.д. — кнопка-переход это feature, а не кусок виджета.
- **Блок экрана со своими данными** (грузит данные, держит store) → `widgets/`.
- **Только отображение переданных пропсов**, без запросов и без своего store → `entities/`.
- **Композиция виджетов и фич** без собственной разметки-логики → `proccesses/`.

❌ `useFetchData` внутри `entities/` — entity не ходит в сеть.
❌ Кнопка с `router.push` прямо в `proccesses/` или `widgets/` — выносится в `features/`.
❌ Экранный файл в `app/`, содержащий разметку — там только `<SomeScreen />`.

## Правило 2. Структура слайса

Слайс — это папка с `index.ts` (public API), который реэкспортирует из `ui/`:

```
features/Fuel/SelectAzsAndColumnForm/
    index.ts                      export * from './ui/SelectAzsAndColumn'
    ui/SelectAzsAndColumn.tsx
    ui/SelectAzsAndColumnSkeleton.tsx
    api/selectAzsAndColumnApi.ts
    model/SomeStore.ts            zustand-store слайса
    lib/useSomething.ts           хуки и хелперы
    config/interfaces/IXxx.ts
    config/enums/EXxx.ts
    config/types/TXxx.ts
    assets/icon.svg
```

- Один экспортируемый компонент на файл, обёрнут в `memo`.
- Импорт слайса — **только через его `index.ts`**, не вглубь в `ui/`.
- Появился запрос → `api/`, появился локальный state на весь слайс → `model/`, появилась чистая функция или хук → `lib/`, появились константы/типы/enum → `config/`. Не держать всё в файле компонента.

## Правило 3. Чек-лист нового слайса

Перед созданием папки ответь на четыре вопроса — в таком порядке:

1. **Точно нужен новый слайс?** Может, это ещё один `ui/`-файл в существующем или новый проп. Слайс — это единица переиспользования, а не единица «мне так удобнее».
2. **Какой слой** — по Правилу 1 (есть действие → `features/`, свои данные → `widgets/`, только пропсы → `entities/`).
3. **Куда внутри слоя.** Домены группируются папкой: `features/Fuel/...`, `features/Coffee/...`, `widgets/Home/...`. Одиночные слайсы лежат в корне слоя (`features/LoginForm`).
4. **Что попадёт в `index.ts`** — наружу торчит только то, что реально импортируют снаружи.

Дальше — структура из Правила 2 и экспорты по [imports.md](imports.md).

## Правило 4. Скелетоны и состояния загрузки

У виджетов и форм с загрузкой рядом лежит `*Skeleton.tsx` в том же `ui/` (см. `SelectAzsAndColumnSkeleton`, `SelectTrkTypeFormSkeleton`). Ошибку загрузки показываем через `entities/ErrorWhileFetchingForm`, а не собственной разметкой.
