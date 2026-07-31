# Навигация — expo-router

## Правило 1. Пути только через `ESCREENS`

Все маршруты перечислены в енаме `ESCREENS` ([EScreens.ts](../../src/shared/common/config/enums/EScreens.ts)).

✅ `router.push(ESCREENS.FUEL_PRICES)`
❌ `router.push('/fuel_prices')` — строковых литералов маршрутов в коде быть не должно.

Заголовки экранов — из `SCREENS_TITLES`, ключ — значение `ESCREENS`.

## Правило 2. Добавление экрана — три шага, не один

1. Файл роута `src/app/<путь>/index.tsx`, внутри — только рендер скрина:
   ```tsx
   export default function Page() {
       return <FuelPricesScreen />
   }
   ```
2. Значение в енаме `ESCREENS` (+ при необходимости в `SCREENS_TITLES`).
3. Регистрация `<Stack.Screen name="<путь>/index" options={{ headerShown: false }} />` в [src/app/_layout.tsx](../../src/app/_layout.tsx).

`headerShown: false` ставим везде — шапка приходит из `layouts/InternalPagesLayout` и виджета `InternalPagesHeader`, а не из нативного хедера.

## Правило 3. Гейт авторизации живёт в корневом layout

[src/app/_layout.tsx](../../src/app/_layout.tsx) рендерит один из двух `Stack` в зависимости от `UserStore.useUser()` и прячет сплэш, когда догрузились шрифты и восстановился пользователь. Проверок «залогинен ли» внутри экранов не делаем.

## Правило 4. Параметры экрана — типизированным `T*ScreenParams`

Параметры маршрута описываются типом в `shared/common/config/types/routeParams/` (`TSuccessScreenParams`, `TContactsScreenParams`, …) и реэкспортируются из бочонка `shared`. Новый экран с параметрами → новый тип там же.

Включён `typedRoutes` ([app.config.ts](../../app.config.ts)), поэтому пути проверяются компилятором.
