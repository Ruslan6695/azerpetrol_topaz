# Состояние — Zustand + immer + селектор-хуки

## Правило 1. Единый шаблон стора

```ts
import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IUserStore } from '../config/interfaces/IUserStore'

const store = create<IUserStore>()(
    immer((set) => ({
        user: null,
        setUser(user) {
            set((state) => {
                state.user = user
            })
        },
    }))
)

export const UserStore = createSelectorHooks(store)
```

- Тип стора — всегда отдельный интерфейс `IXxxStore` в `config/interfaces/`.
- Мутируем черновик immer внутри `set`, не собираем новый объект вручную.
- Наружу экспортируется **только** результат `createSelectorHooks`, не сырой `store`.

## Правило 2. Потребление — через сгенерированные хуки

```ts
const user = UserStore.useUser()
const setBalance = UserStore.useSetBalance()
const COLORS = ThemeStore.useCOLORS()
```

❌ `useStore((s) => s.user)` — селекторы вручную не пишем.

## Правило 3. Где живёт стор

- Глобальные: [src/shared/common/model/](../../src/shared/common/model/) — `UserStore` (пользователь, токен, баланс), `ThemeStore` (палитра и тема), `AppStore` (сеть `isHasNet`, флаг `isTokenRefreshed`), `FuelStore`.
- Стор одного виджета/слайса — в `model/` этого слайса (например `widgets/Home/HomeMainWidget/model/HomeStore.ts`).

Новый глобальный стор заводим, только если состояние реально нужно нескольким слоям; иначе — стор слайса или локальный `useState`.

## Правило 4. Персистентность — через AsyncStorage-хелперы

Работа с AsyncStorage идёт только через хелперы из `shared/common/config/lib/asyncStorage/` (`getItemFromAsyncStorage`, `setItemToAsyncStorage`, `removeItemFromAsyncStorage`, `getToken`), а ключи — только из енама `EAsyncStoreKeys`. Прямой вызов `AsyncStorage.getItem` в компонентах запрещён.
