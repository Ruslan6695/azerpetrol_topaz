# Работа с данными и API

React-query в проекте нет. Все запросы идут через три общих хука из `shared`.

## Правило 1. Выбор хука

| Хук | Когда |
|-----|-------|
| `useFetchData` | получить данные в локальный state хука (`data`, `setData`) |
| `useFetchStoreData` | получить данные и положить их в сеттер zustand-стора (`setData`) |
| `useSendFetch` | мутация: отправили и обработали в колбэках, данные не хранятся |

```ts
const { fetchData, isDataLoading, data, errorText } = useFetchData<IHomeData>({
    apiCallback: homeMainWidgetApi.getHome,
    errorText: 'Ошибка при загрузке данных',
})

fetchData({
    args: undefined,
    hideToastOnError: true,
    afterDataCallback(data) {
        setBalance({ balance: data.balance })
    },
})
```

Опции вызова: `args`, `beforeCallback`, `afterDataCallback`, `onErrorCallback`, `finalyCallback`, `ownSetIsLoading`, `hideToastOnError`, `disableSetLoading`, `leaveErrorBeforeLoading`.

❌ Голый `axios`/`fetch` с ручным `try/catch` и `useState(isLoading)` в компоненте.

## Правило 2. Что хуки делают централизованно — не дублировать

- Показывают тост ошибки через `showError`. Нужен инлайновый текст ошибки вместо тоста — передай `hideToastOnError: true` и читай `errorText`.
- **Разлогинивают на HTTP 401** (`EResponseStatuses.INVALID_TOKEN`). Своей обработки 401 в компонентах быть не должно.
- Ведут `isDataLoading`. Свой флаг загрузки заводим только если нужен отдельный индикатор — тогда через `ownSetIsLoading`.

⚠️ Объект в `afterDataCallback` мутировать нельзя — он же уходит в state/стор.

## Правило 3. Формат API-модуля

Файл `api/xxxApi.ts` экспортирует **объект с асинхронными методами**, использует общий `axiosIntsanse` (имя с опечаткой — так в коде) и тянет токен из AsyncStorage на каждый вызов:

```ts
import { axiosIntsanse, getToken } from '../../../../shared'
import { IGetAzsListData } from '../config/interfaces/IGetAzsListData'

export const selectAzsAndColumnApi = {
    getAzsList: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetAzsListData>('get_azs_list/', {
            params: { token },
        })
        return resp.data
    },
}
```

- Ответ типизируется дженериком `axiosIntsanse.get<IXxxData>` и интерфейсом в `config/interfaces/`.
- Возвращаем `resp.data`, а не `resp`.
- Авторизация — **query-параметр `token`**, а не заголовок.
- Базовый URL — только в [axiosInstanse.ts](../../src/shared/common/api/axiosInstanse.ts). Полные URL в вызовах не пишем.
- Никаких запросов из `ui/` — только из `api/` через хук.
