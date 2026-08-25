# Перевод налива на Топаз — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переключить запуск и опрос статуса налива в мобильном приложении «Азерпетрол» с прямого проксирования контроллера ТРК на систему Топаз, общаясь с ней через новый упрощённый контракт с собственным сервером пользователя, и убрать шаг сканирования QR-кода колонки.

**Architecture:** Меняется только клиентская часть (этот репозиторий) — существующие FSD-слайсы (`features/Fuel/*`, `widgets/FuelLoading/*`, `shared/common/model/fuelStore`) получают новые `api/`, `config/interfaces/`, `config/enums/` под новый контракт с сервером; сам сервер и его разговор с Топаз вне области этого плана. Экранный флоу (`main → selectAzsAndColumn → selectTrkType → selectLiters → fuelLoading(start/fuelling/end/error)`) не меняется, меняются только идентификаторы (`azs.id: string`, `column` без `device`, `ITrkType → IFuelOption`) и статусная модель налива (`EFuelOrderStatus` вместо сырых статусов контроллера). Шаг сканирования (`widgets/Fuel/FuelScanBarcodeWidget`) удаляется целиком.

**Tech Stack:** Expo SDK 54 / React Native 0.81 / React 19, TypeScript strict, Zustand + immer + `auto-zustand-selectors-hook`, `axios` через `axiosIntsanse`, `useFetchData`/`useSendFetch` из `shared`.

**Spec:** [plans/topaz-fuelling-integration-design.md](topaz-fuelling-integration-design.md)

## Global Constraints

- Старая система налива отключается полностью — provider-абстракция не нужна (из спеки).
- Сканирование колонки убрано — идентификация только ручным выбором из списка (из спеки).
- Контракт мобильное приложение↔сервер — свой упрощённый (`azsId/columnId/fuelId/price/sum`), не зеркалирует поля Топазовского `Order` (из спеки).
- Бонусная логика (`discount/cashback/bonus`, `balance`, `bonus_balance`, `fuel_on_debt`) не меняется по сути, переезжает на `fuelId` (из спеки).
- В проекте нет автотестов и линтера. Верификация — `npx tsc --noEmit`, сравнение с базовой линией **5 предсуществующих ошибок** (см. `CLAUDE.md`). Из-за сквозного переименования типа `ITrkType → IFuelOption` и смены `IAzs.id: number → string` проект **не проходит чистую компиляцию между Task 1 и Task 9** — это ожидаемо для переименования типа, использующегося в 10+ файлах разом, без временных алиасов (YAGNI). Единственная обязательная контрольная точка — Task 10 (полный `tsc --noEmit` в конце).
- Форматирование — 4 пробела, без `;`, одинарные кавычки, `trailingComma: es5` ([.prettierrc.cjs](../.prettierrc.cjs)).
- Импорты только относительные; слайс — через его `index.ts`; невизуальный `shared` — через `src/shared/index.ts`.
- Тексты интерфейса и комментарии — на русском, имена переменных/файлов — на английском.
- Компоненты — функциональные, обёрнуты в `memo`; обработчики — `handleXxx` в `useCallback`.
- Коммитить только явно указанным шагом `git commit`, не пушить.

---

### Task 1: Общая модель данных (`shared`)

**Files:**
- Modify: `src/shared/common/config/interfaces/IFuel.ts`
- Modify: `src/shared/common/config/interfaces/IFuelStore.ts`
- Modify: `src/shared/common/model/fuelStore.ts`

**Interfaces:**
- Produces: `IAzs{id: string, name: string}`, `IColumn{id: number}`, `IFuelOption{fuelId: string, name: string, price: number, discount?: TFuelModifier, cashback?: TFuelModifier, bonus?: TFuelModifier}`, `IFuelStore.state.fuelOption`, `IFuelStore.state.orderId`, `FuelStore.useChangeFuelOption()`, `FuelStore.useChangeOrderId()` — все последующие задачи их потребляют.

- [ ] **Step 1: Переписать `IFuel.ts`**

```ts
import { TFuelModifier } from '../types/TFuelModifier'

export interface IAzs {
    id: string
    name: string
}

export interface IColumn {
    id: number
}

export interface IFuelOption {
    fuelId: string
    name: string
    price: number
    /** Скидка с цены литра */
    discount?: TFuelModifier
    /** Возврат деньгами за заправку */
    cashback?: TFuelModifier
    /** Начисление баллами за заправку */
    bonus?: TFuelModifier
}
```

- [ ] **Step 2: Переписать `IFuelStore.ts`**

```ts
import { IAzs, IColumn, IFuelOption } from "./IFuel";

export interface IFuelStore {
  state: {
    azs: IAzs | null;
    column: IColumn | null;
    fuelOption: IFuelOption | null;
    liters: number | null;
    rubles: number | null;
    fuelOnDebt: boolean;
    /** Заказ на сервере, создаётся в fuelling/start/, нужен для поллинга статуса */
    orderId: string | null;
  };
  tankVolume: number;
  changeTankVolume: (volume: number) => void;
  getTankVolume: () => Promise<void>;
  clearState: () => void;
  changeAzs: (azs: IAzs) => void;
  changeColumn: (column: IColumn) => void;
  changeFuelOption: (fuelOption: IFuelOption) => void;
  changeFuelOnDebt: (fuelOnDebt: boolean) => void;
  changeOrderId: (orderId: string) => void;
  changeLitersAndRubles: ({
    liters,
    rubles,
  }: {
    rubles: number;
    liters: number;
  }) => void;
}
```

- [ ] **Step 3: Обновить `fuelStore.ts`**

Переименовать `state.trkType` → `state.fuelOption`, `changeTrkType` → `changeFuelOption`, добавить `state.orderId: null` и `changeOrderId`, добавить сброс `orderId` в `clearState()`:

```ts
import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DEFAULT_TANK_VOLUME } from '../config/constants/TANK_VOLUME'
import { EAsyncStoreKeys } from '../config/enums/EAsyncStoreKeys'
import { IFuelStore } from '../config/interfaces/IFuelStore'
import { getItemFromAsyncStorage } from '../config/lib/asyncStorage/getItemFromAsyncStorage'
import { setItemToAsyncStorage } from '../config/lib/asyncStorage/setItemToAsyncStorage'

const store = create<IFuelStore>()(
    immer((set) => ({
        tankVolume: DEFAULT_TANK_VOLUME,
        state: {
            azs: null,
            column: null,
            liters: null,
            rubles: null,
            fuelOption: null,
            fuelOnDebt: false,
            orderId: null,
        },
        changeAzs(azs) {
            set((state) => {
                state.state.azs = azs
            })
        },
        changeColumn(column) {
            set((state) => {
                state.state.column = column
            })
        },
        changeFuelOption(fuelOption) {
            set((state) => {
                state.state.fuelOption = fuelOption
            })
        },
        changeLitersAndRubles({ liters, rubles }) {
            set((state) => {
                state.state.liters = liters
                state.state.rubles = rubles
            })
        },
        changeFuelOnDebt(fuelOnDebt) {
            set((state) => {
                state.state.fuelOnDebt = fuelOnDebt
            })
        },
        changeOrderId(orderId) {
            set((state) => {
                state.state.orderId = orderId
            })
        },
        changeTankVolume(volume) {
            set((state) => {
                state.tankVolume = volume
                setItemToAsyncStorage({
                    key: EAsyncStoreKeys.TANK_VOLUME,
                    value: String(volume),
                })
            })
        },
        async getTankVolume() {
            const stored = await getItemFromAsyncStorage(
                EAsyncStoreKeys.TANK_VOLUME
            )
            const parsed = Number(stored)

            if (!stored || isNaN(parsed) || parsed <= 0) return

            set((state) => {
                state.tankVolume = parsed
            })
        },
        clearState() {
            set((state) => {
                state.state.azs = null
                state.state.column = null
                state.state.fuelOption = null
                state.state.liters = null
                state.state.rubles = null
                state.state.fuelOnDebt = false
                state.state.orderId = null
            })
        },
    }))
)

export const FuelStore = createSelectorHooks(store)
```

- [ ] **Step 4: Зафиксировать ожидаемое состояние компиляции**

Run: `npx tsc --noEmit`
Expected: количество ошибок выросло относительно базовых 5 — это ожидаемо (см. Global Constraints), новые ошибки будут в файлах, которые правят задачи 2–9 (`ITrkType` не существует, `column.name`/`column.device` не существуют, `azs.id` типа `string` не сходится со старым `number`, `trkType`/`changeTrkType` не существуют). Дальше не чинить — это делают следующие задачи.

- [ ] **Step 5: Commit**

```bash
git add src/shared/common/config/interfaces/IFuel.ts src/shared/common/config/interfaces/IFuelStore.ts src/shared/common/model/fuelStore.ts
git commit -m "refactor(fuel): новая модель данных под Топаз (IFuelOption, string id АЗС, orderId)"
```

---

### Task 2: Шаг выбора АЗС и колонки

**Files:**
- Modify: `src/features/Fuel/SelectAzsAndColumnForm/api/selectAzsAndColumnApi.ts`
- Modify: `src/features/Fuel/SelectAzsAndColumnForm/config/interfaces/IGetAzsListData.ts`
- Modify: `src/features/Fuel/SelectAzsAndColumnForm/config/interfaces/IGetColumnsData.ts`
- Modify: `src/features/Fuel/SelectAzsAndColumnForm/ui/SelectAzsAndColumn.tsx`
- Modify: `src/entities/Fuel/FuelListRow/ui/FuelListRow.tsx`

**Interfaces:**
- Consumes: `IAzs`, `IColumn` из Task 1.
- Produces: `selectAzsAndColumnApi.getAzsList()`, `selectAzsAndColumnApi.getColumns({azs_id: string})` — используются `FuelSelectAzsAndColumnWidget` без изменений (сигнатура компонента `SelectAzsAndColumn` не меняется).

- [ ] **Step 1: Обновить `selectAzsAndColumnApi.ts`**

```ts
import { axiosIntsanse, getToken } from '../../../../shared'
import { IGetAzsListData } from '../config/interfaces/IGetAzsListData'
import { IGetColumnsData } from '../config/interfaces/IGetColumnsData'

export const selectAzsAndColumnApi = {
    getAzsList: async () => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetAzsListData>(
            'fuelling/stations/',
            { params: { token } }
        )
        return resp.data
    },
    getColumns: async ({ azs_id }: { azs_id: string }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<IGetColumnsData>(
            'fuelling/columns/',
            { params: { token, azs_id } }
        )
        return resp.data
    },
}
```

- [ ] **Step 2: Обновить интерфейсы ответов**

`IGetAzsListData.ts` (без изменений по форме, тип `IAzs` подтянется новый):
```ts
import { IAzs } from '../../../../../shared'

export interface IGetAzsListData {
    azs_list: IAzs[]
}
```

`IGetColumnsData.ts` (убрать неиспользуемый импорт `ITrkType`):
```ts
import { IColumn } from '../../../../../shared'

export interface IGetColumnsData {
    trcs: IColumn[]
}
```

- [ ] **Step 3: Обновить `FuelListRow.tsx` — id теперь строка**

В `type Props` заменить:
```ts
    id: string
    ...
    onSelect: (id: string) => void
```
и в теле компонента `onSelect(id)` не меняется — только сигнатура типа.

- [ ] **Step 4: Обновить `SelectAzsAndColumn.tsx`**

- `useFetchData<IGetColumnsData, { azs_id: number }>` → `useFetchData<IGetColumnsData, { azs_id: string }>`
- `handleSelectAzs = useCallback((azsId: number) => {...` → `(azsId: string) => {...`
- в `columnOptions` заменить `label: \`Колонка № ${trc.name}\`` → `` label: `Колонка № ${trc.id}` `` (у `IColumn` больше нет `name`)

Остальной код файла (шаги `azs`/`column`, работа с `ErrorWhileFetchingForm`, `CenteredState`, `GlassSelect`) не меняется.

- [ ] **Step 5: Проверить типы**

Run: `npx tsc --noEmit`
Expected: ошибки в файлах этой задачи (`SelectAzsAndColumn.tsx`, `IGetColumnsData.ts`, `FuelListRow.tsx`) больше не появляются; остаются только ошибки в файлах, которые правят задачи 3–9 (см. Task 1, Step 4).

- [ ] **Step 6: Commit**

```bash
git add src/features/Fuel/SelectAzsAndColumnForm src/entities/Fuel/FuelListRow
git commit -m "refactor(fuel): выбор АЗС/колонки под новый контракт (id строкой, без device)"
```

---

### Task 3: Шаг выбора топлива

**Files:**
- Modify: `src/features/Fuel/SelectTrkTypeForm/api/selectTrkTypeApi.ts`
- Modify: `src/features/Fuel/SelectTrkTypeForm/config/interfaces/ISelectTrkTypeData.ts`
- Modify: `src/features/Fuel/SelectTrkTypeForm/ui/SelectTrkTypeForm.tsx`
- Modify: `src/features/Fuel/SelectTrkTypeForm/ui/TrkTypeRow.tsx`
- Modify: `src/widgets/Fuel/FuelSelectTrkTypeWidget/ui/FuelSelectTrkTypeWidget.tsx`

**Interfaces:**
- Consumes: `IFuelOption`, `FuelStore.useChangeFuelOption()` из Task 1; `IAzs`, `IColumn` из Task 1/2.
- Produces: `SelectTrkTypeForm` с проп `onSelectFuelOption: (fuelOption: IFuelOption) => void` — используется дальше в Task 4 неявно через `FuelStore.fuelOption`.

- [ ] **Step 1: Обновить `selectTrkTypeApi.ts`**

```ts
import { axiosIntsanse, getToken } from '../../../../shared'
import { ISelectTrkTypeData } from '../config/interfaces/ISelectTrkTypeData'

export const selectTrkTypeApi = {
    getFuelOptions: async ({
        azsId,
        columnId,
    }: {
        azsId: string
        columnId: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.get<ISelectTrkTypeData>(
            'fuelling/fuel_types/',
            { params: { token, azs_id: azsId, column_id: columnId } }
        )
        return resp.data
    },
}
```

- [ ] **Step 2: Обновить `ISelectTrkTypeData.ts`**

```ts
import { IFuelOption } from '../../../../../shared'

export interface ISelectTrkTypeData {
    fuel_options: IFuelOption[]
    balance: number
    bonus_balance: number
    fuel_on_debt: boolean
}
```

- [ ] **Step 3: Обновить `TrkTypeRow.tsx`**

```ts
import { memo, useCallback } from 'react'
import { FuelPriceRow } from '../../../../entities/Fuel/FuelPriceRow'
import { IFuelOption } from '../../../../shared'

type Props = {
    fuelOption: IFuelOption
    onSelect: (fuelOption: IFuelOption) => void
}

export const TrkTypeRow = memo(({ fuelOption, onSelect }: Props) => {
    const handlePress = useCallback(() => {
        onSelect(fuelOption)
    }, [fuelOption, onSelect])

    return (
        <FuelPriceRow
            name={fuelOption.name}
            price={fuelOption.price}
            discount={fuelOption.discount}
            cashback={fuelOption.cashback}
            bonus={fuelOption.bonus}
            unit="₽/л"
            onPress={handlePress}
        />
    )
})
```

- [ ] **Step 4: Обновить `SelectTrkTypeForm.tsx`**

- Импорт `ITrkType` → `IFuelOption`.
- Проп `onSelectTrkType: (trkType: ITrkType) => void` → `onSelectFuelOption: (fuelOption: IFuelOption) => void`.
- `useFetchData<ISelectTrkTypeData, { azsId: number; columnId: number }>` → `{ azsId: string; columnId: number }`.
- `apiCallback: selectTrkTypeApi.getTrkTypes` → `selectTrkTypeApi.getFuelOptions`.
- `!data?.trc_types?.length` → `!data?.fuel_options?.length`.
- список рендера:
```tsx
{data.fuel_options.map((option) => (
    <TrkTypeRow
        key={option.fuelId}
        fuelOption={option}
        onSelect={onSelectFuelOption}
    />
))}
```
(остальной код — `errorText`, `SelectTrkTypeFormSkeleton`, `handleReloadData` — не меняется, кроме использования переименованного пропа `onSelectFuelOption` вместо `onSelectTrkType`).

- [ ] **Step 5: Обновить `FuelSelectTrkTypeWidget.tsx`**

```ts
import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { SelectTrkTypeForm } from '../../../../features/Fuel/SelectTrkTypeForm'
import {
    FuelStore,
    IFuelOption,
    SIZES,
    SPACING,
    TFuelRoad,
} from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { FUEL_SELECT_TRK_TYPE_INFO_TEXTS } from '../config/constants/FUEL_SELECT_TRK_TYPE_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
}

export const FuelSelectTrkTypeWidget = memo(({ setRoad }: Props) => {
    const fuelStore = FuelStore.useState()
    const changeFuelOption = FuelStore.useChangeFuelOption()

    const handleSelectFuelOption = useCallback(
        (fuelOption: IFuelOption) => {
            changeFuelOption(fuelOption)
            setRoad('selectLiters')
        },
        [changeFuelOption, setRoad]
    )

    const handleGoBack = useCallback(() => {
        setRoad('selectAzsAndColumn')
    }, [setRoad])

    const isReady = Boolean(fuelStore.azs && fuelStore.column)
    useEffect(() => {
        if (!isReady) {
            setRoad('selectAzsAndColumn')
        }
    }, [isReady, setRoad])

    const styles = StyleSheet.create({
        info: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    if (!fuelStore.azs || !fuelStore.column) {
        return null
    }

    return (
        <>
            <SelectTrkTypeForm
                onGoBack={handleGoBack}
                onSelectFuelOption={handleSelectFuelOption}
                azs={fuelStore.azs}
                column={fuelStore.column}
            />
            <MPLayout mt={SPACING.SECTION}>
                <View style={styles.info}>
                    {FUEL_SELECT_TRK_TYPE_INFO_TEXTS.map((info) => (
                        <InfoCard key={info.title} {...info} />
                    ))}
                </View>
            </MPLayout>
        </>
    )
})
```

- [ ] **Step 6: Проверить типы**

Run: `npx tsc --noEmit`
Expected: ошибки в файлах этой задачи больше не появляются.

- [ ] **Step 7: Commit**

```bash
git add src/features/Fuel/SelectTrkTypeForm src/widgets/Fuel/FuelSelectTrkTypeWidget
git commit -m "refactor(fuel): выбор топлива через IFuelOption вместо ITrkType"
```

---

### Task 4: Шаг суммы и литров

**Files:**
- Modify: `src/features/Fuel/SelectLiters/ui/SelectLiters.tsx`
- Modify: `src/features/Fuel/SelectLiters/ui/FuelBonusCard.tsx`
- Modify: `src/widgets/Fuel/FuelSelectLitersWidget/ui/FuelSelectLitersWidget.tsx`

**Interfaces:**
- Consumes: `IFuelOption` из Task 1, `FuelStore.state.fuelOption` из Task 1.
- Produces: без изменений наружу — `SelectLiters.onSubmit({liters, rubles})` та же сигнатура.

- [ ] **Step 1: Обновить `SelectLiters.tsx`**

- Проп `trkType: ITrkType` → `fuelOption: IFuelOption` (импорт `IFuelOption` вместо `ITrkType`).
- Все обращения `trkType.price` → `fuelOption.price`, `trkType.name` → `fuelOption.name`.
- `<FuelBonusCard trkType={trkType} liters={liters} />` → `<FuelBonusCard fuelOption={fuelOption} liters={liters} />`.
- Строка сводки:
```tsx
<ListRow
    title="Топливо"
    value={`${fuelOption.name} · Колонка ${column.id}`}
/>
```
(было `column.name` — поля больше нет).

- [ ] **Step 2: Обновить `FuelBonusCard.tsx`**

```ts
import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    calcFuelModifierAmount,
    collectFuelModifiers,
    formatFuelModifierAmount,
    IFuelOption,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'

type Props = {
    fuelOption: IFuelOption
    liters: number
}

const ICON_SIZE = 30

export const FuelBonusCard = memo(({ fuelOption, liters }: Props) => {
    const lines = useMemo(
        () =>
            collectFuelModifiers(fuelOption, [
                'bonus',
                'cashback',
                'discount',
            ]).map(({ kind, modifier }) => ({
                kind,
                text: formatFuelModifierAmount(
                    kind,
                    calcFuelModifierAmount(modifier, fuelOption.price, liters)
                ),
            })),
        [fuelOption, liters]
    )

    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.LG * SIZES.PX,
        },
        icon: {
            width: ICON_SIZE * SIZES.PX,
            alignItems: 'center',
        },
        texts: {
            flex: 1,
        },
    })

    if (!lines.length) {
        return null
    }

    const [main, ...rest] = lines

    return (
        <GlassCard
            variant="bonus"
            radius={RADII.CARD}
            paddingVertical={SPACING.XL}
            paddingHorizontal={18}
        >
            <View style={styles.row}>
                <View style={styles.icon}>
                    {main.kind === 'cashback' ? (
                        <Typography type="h3" customColor={COLORS.TEXT.Primary}>
                            ₽
                        </Typography>
                    ) : (
                        <Icon name="bonus" size={ICON_SIZE} />
                    )}
                </View>
                <View style={styles.texts}>
                    <Typography type="label14">{main.text}</Typography>
                    {rest.map((line) => (
                        <Typography
                            key={line.kind}
                            type="caption12"
                            color="secondary"
                            marginsPaddings={{ mt: 2 }}
                        >
                            {line.text}
                        </Typography>
                    ))}
                </View>
            </View>
        </GlassCard>
    )
})
```

- [ ] **Step 3: Обновить `FuelSelectLitersWidget.tsx`**

Заменить везде `fuelStore.trkType` → `fuelStore.fuelOption`, проп `trkType={fuelStore.trkType}` → `fuelOption={fuelStore.fuelOption}` в вызове `<SelectLiters .../>`.

- [ ] **Step 4: Проверить типы**

Run: `npx tsc --noEmit`
Expected: ошибки в файлах этой задачи больше не появляются.

- [ ] **Step 5: Commit**

```bash
git add src/features/Fuel/SelectLiters src/widgets/Fuel/FuelSelectLitersWidget
git commit -m "refactor(fuel): шаг литров/суммы использует IFuelOption"
```

---

### Task 5: Статусы и ошибки налива

**Files:**
- Create: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/enums/EFuelOrderStatus.ts`
- Delete: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/enums/EFuelLoadingFuellingStatuses.ts`
- Modify: `src/shared/common/config/enums/EFuellingErrorKind.ts`
- Modify: `src/shared/common/config/lib/helpers/getFuellingErrorText.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingErrorWidget/ui/FuelLoadingErrorWidget.tsx`
- Modify: `src/proccesses/FuelLoading/ui/FuelLoading.tsx`

**Interfaces:**
- Produces: `EFuelOrderStatus` (потребляется Task 7), `EFuellingErrorKind{EXPIRED,STATION_CANCELED,USER_CANCELED,TIMEOUT}`, `getFuellingErrorText(kind, reason?)`, `FuelLoadingErrorWidget` проп `reason?: string`.

- [ ] **Step 1: Создать `EFuelOrderStatus.ts`**

```ts
// Статусы заказа приходят от Топаз через наш сервер как есть (см.
// plans/topaz-fuelling-integration-design.md). Промежуточных состояний
// вроде «снимите пистолет» Топаз не даёт — этой детализации в статусе нет.
export enum EFuelOrderStatus {
    ORDER_CREATED = 'OrderCreated',
    ACCEPTED = 'Accepted',
    FUELING = 'Fueling',
    COMPLETED = 'Completed',
    EXPIRED = 'Expired',
    STATION_CANCELED = 'StationCanceled',
    USER_CANCELED = 'UserCanceled',
}
```

- [ ] **Step 2: Удалить `EFuelLoadingFuellingStatuses.ts`**

```bash
git rm src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/enums/EFuelLoadingFuellingStatuses.ts
```

- [ ] **Step 3: Обновить `EFuellingErrorKind.ts`**

```ts
// Причины, по которым налив прерван — статусы заказа Топаз, которые
// не ведут на экран итогов, плюс собственный клиентский таймаут.
export enum EFuellingErrorKind {
    EXPIRED = 'EXPIRED',
    STATION_CANCELED = 'STATION_CANCELED',
    USER_CANCELED = 'USER_CANCELED',
    TIMEOUT = 'TIMEOUT',
}
```

- [ ] **Step 4: Обновить `getFuellingErrorText.ts`**

```ts
import { EFuellingErrorKind } from '../../enums/EFuellingErrorKind'

const TEXTS: Record<
    EFuellingErrorKind,
    { title: string; description: string }
> = {
    [EFuellingErrorKind.EXPIRED]: {
        title: 'Колонка не ответила',
        description:
            'Станция не подтвердила заказ вовремя. Попробуйте запустить налив ещё раз.',
    },
    [EFuellingErrorKind.STATION_CANCELED]: {
        title: 'Заказ отменён станцией',
        description: 'АЗС отменила заказ. Обратитесь к оператору АЗС.',
    },
    [EFuellingErrorKind.USER_CANCELED]: {
        title: 'Заказ отменён',
        description: 'Налив был отменён.',
    },
    [EFuellingErrorKind.TIMEOUT]: {
        title: 'Колонка не отвечает',
        description:
            'Мы долго не получаем статус налива. Проверьте состояние колонки или обратитесь к оператору АЗС.',
    },
}

// Причина от сервера (если пришла) точнее нашего общего текста — показываем её.
export const getFuellingErrorText = (
    kind: EFuellingErrorKind,
    reason?: string
) => {
    const base = TEXTS[kind]
    return reason ? { ...base, description: reason } : base
}
```

- [ ] **Step 5: Обновить `FuelLoadingErrorWidget.tsx`**

Добавить проп `reason?: string`, прокинуть в `getFuellingErrorText`:

```ts
type Props = {
    kind: EFuellingErrorKind
    reason?: string
    onRetry: () => void
}

export const FuelLoadingErrorWidget = memo(({ kind, reason, onRetry }: Props) => {
    const router = useRouter()
    const clearState = FuelStore.useClearState()
    const { title, description } = getFuellingErrorText(kind, reason)
    // ...остальной код без изменений
```

- [ ] **Step 6: Обновить `proccesses/FuelLoading/ui/FuelLoading.tsx`**

Прокинуть `reason` рядом с `errorKind`:

```tsx
const [errorKind, setErrorKind] = useState<EFuellingErrorKind | null>(null)
const [errorReason, setErrorReason] = useState<string | undefined>(undefined)

const handleFuellingError = useCallback(
    (kind: EFuellingErrorKind, reason?: string) => {
        setErrorKind(kind)
        setErrorReason(reason)
        setRoad('error')
    },
    []
)

// ...

case 'error':
    return errorKind ? (
        <FuelLoadingErrorWidget
            kind={errorKind}
            reason={errorReason}
            onRetry={handleRetry}
        />
    ) : null
```

- [ ] **Step 7: Проверить типы**

Run: `npx tsc --noEmit`
Expected: ошибки в этих файлах больше не появляются (кроме тех, что чинят Task 6–7, где `onError` вызывается с новой сигнатурой).

- [ ] **Step 8: Commit**

```bash
git add src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/enums src/shared/common/config/enums/EFuellingErrorKind.ts src/shared/common/config/lib/helpers/getFuellingErrorText.ts src/widgets/FuelLoading/FuelLoadingErrorWidget src/proccesses/FuelLoading
git commit -m "refactor(fuel): статусы заказа Топаз и причины отмены налива"
```

---

### Task 6: Запуск налива

**Files:**
- Create: `src/widgets/FuelLoading/FuelLoadingStartWidget/config/interfaces/IFuelLoadingStartData.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingStartWidget/api/fuelLoadingStartApi.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingStartWidget/ui/FuelLoadingStartWidget.tsx`

**Interfaces:**
- Consumes: `IFuelOption`, `FuelStore.state.fuelOption`, `FuelStore.useChangeOrderId()` из Task 1.
- Produces: `orderId`, записанный в `FuelStore` — потребляется Task 7 (`FuelLoadingFuellingWidget`).

- [ ] **Step 1: Создать `IFuelLoadingStartData.ts`**

```ts
export interface IFuelLoadingStartData {
    orderId: string
}
```

- [ ] **Step 2: Обновить `fuelLoadingStartApi.ts`**

```ts
import { axiosIntsanse, getToken } from '../../../../shared'
import { IFuelLoadingStartData } from '../config/interfaces/IFuelLoadingStartData'

export const fuelLoadingStartApi = {
    startFuelling: async ({
        azsId,
        columnId,
        fuelId,
        price,
        sumRub,
    }: {
        azsId: string
        columnId: number
        fuelId: string
        price: number
        sumRub: number
    }) => {
        const token = await getToken()
        const resp = await axiosIntsanse.post<IFuelLoadingStartData>(
            'fuelling/start/',
            {
                azs_id: azsId,
                column_id: columnId,
                fuel_id: fuelId,
                price,
                sum: sumRub,
            },
            { params: { token } }
        )
        return resp.data
    },
}
```

- [ ] **Step 3: Обновить `FuelLoadingStartWidget.tsx`**

```ts
import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    FuelStore,
    SIZES,
    TFuelLoadingRoad,
    useSendFetch,
} from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { Icon } from '../../../../shared/Icons'
import { fuelLoadingStartApi } from '../api/fuelLoadingStartApi'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelLoadingRoad>>
}

export const FuelLoadingStartWidget = memo(({ setRoad }: Props) => {
    const router = useRouter()
    const { azs, column, fuelOption, liters, rubles } = FuelStore.useState()
    const changeOrderId = FuelStore.useChangeOrderId()
    const { sendFetch, isSendFetchLoading, errorText } = useSendFetch({
        apiCallback: fuelLoadingStartApi.startFuelling,
        errorText: 'Не удалось начать налив',
    })

    const handleStartFuelling = useCallback(async () => {
        if (!azs || !column || !fuelOption || !rubles) return

        await sendFetch({
            args: {
                azsId: azs.id,
                columnId: column.id,
                fuelId: fuelOption.fuelId,
                price: fuelOption.price,
                sumRub: rubles,
            },
            hideToastOnError: true,
            afterDataCallback(data) {
                changeOrderId(data.orderId)
                setRoad('fuelling')
            },
        })
    }, [azs, column, fuelOption, rubles, sendFetch, changeOrderId, setRoad])

    const handleCancel = useCallback(() => {
        router.back()
    }, [router])

    const styles = StyleSheet.create({
        container: {
            minHeight: SIZES.HEIGHT(0.7),
        },
    })

    if (!azs || !column || !fuelOption || !liters || !rubles) return null

    return (
        <>
            <StepHeader title="Запуск налива" onBack={handleCancel} />
            <View style={styles.container}>
                <CenteredState
                    icon={<Icon name="tab_fuel" size={44} />}
                    title="Готовы начать налив?"
                    description={`${azs.name} · Колонка ${column.id} · ${fuelOption.name} · ${liters.toFixed(1)} л на ${rubles} ₽`}
                    error={errorText}
                    action={{
                        label: 'Запустить колонку',
                        onPress: handleStartFuelling,
                        variant: 'primary',
                        loading: isSendFetchLoading,
                    }}
                    secondaryAction={{
                        label: 'Отмена',
                        onPress: handleCancel,
                    }}
                />
            </View>
        </>
    )
})
```

- [ ] **Step 4: Проверить типы**

Run: `npx tsc --noEmit`
Expected: ошибки в файлах этой задачи больше не появляются.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/FuelLoading/FuelLoadingStartWidget
git commit -m "refactor(fuel): запуск налива через POST fuelling/start/ с orderId"
```

---

### Task 7: Поллинг статуса налива

**Files:**
- Modify: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/interfaces/IFuelLoadingFuellingArgs.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/interfaces/IFuelLoadingFuellingData.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/api/fuelLoadingFuellingApi.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/config/constants/FUELLING_STATUS_TEXTS.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/lib/useFuellingPolling.ts`
- Modify: `src/widgets/FuelLoading/FuelLoadingFuellingWidget/ui/FuelLoadingFuellingWidget.tsx`

**Interfaces:**
- Consumes: `EFuelOrderStatus` (Task 5), `EFuellingErrorKind` (Task 5), `FuelStore.state.{azs,column,fuelOption,liters,orderId}` (Task 1/6).
- Produces: `onEndFuelling(totals: IFuellingTotals)`, `onError(kind: EFuellingErrorKind, reason?: string)` — сигнатура `onError` меняется (добавлен `reason`), обновить вызывающего в `proccesses/FuelLoading` — уже сделано в Task 5, Step 6.

- [ ] **Step 1: Обновить `IFuelLoadingFuellingArgs.ts`**

```ts
export interface IFuelLoadingFuellingArgs {
    orderId: string
}
```

- [ ] **Step 2: Обновить `IFuelLoadingFuellingData.ts`**

```ts
import { EFuelOrderStatus } from '../enums/EFuelOrderStatus'

export interface IFuelLoadingFuellingData {
    status: EFuelOrderStatus
    volume: number
    sum: number
    /** Причина отмены/просрочки от сервера, есть только на терминальных статусах отмены */
    reason?: string
}
```

- [ ] **Step 3: Обновить `fuelLoadingFuellingApi.ts`**

```ts
import { axiosIntsanse, getToken } from '../../../../shared'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
import { IFuelLoadingFuellingData } from '../config/interfaces/IFuelLoadingFuellingData'

export const fuelLoadingFuellingApi = {
    getStatus: async ({ orderId }: IFuelLoadingFuellingArgs) => {
        const token = await getToken()

        const resp = await axiosIntsanse.get<IFuelLoadingFuellingData>(
            'fuelling/status/',
            { params: { token, order_id: orderId } }
        )
        return resp.data
    },
}
```

- [ ] **Step 4: Обновить `FUELLING_STATUS_TEXTS.ts`**

```ts
import { EFuelOrderStatus } from '../enums/EFuelOrderStatus'

// Терминальные статусы (Completed / Expired / StationCanceled / UserCanceled)
// сюда не попадают — на них поллинг уводит с экрана.
export const FUELLING_STATUS_TEXTS: Partial<
    Record<EFuelOrderStatus, string>
> = {
    [EFuelOrderStatus.ORDER_CREATED]: 'Готовим колонку…',
    [EFuelOrderStatus.ACCEPTED]: 'Готовим колонку…',
    [EFuelOrderStatus.FUELING]: 'Идёт налив…',
}

export const FUELLING_STATUS_PENDING_TEXT = 'Подключаемся к колонке…'
```

- [ ] **Step 5: Переписать `useFuellingPolling.ts`**

```ts
import { useEffect, useRef, useState } from 'react'
import {
    EFuellingErrorKind,
    IFuellingTotals,
    useFetchData,
} from '../../../../shared'
import { fuelLoadingFuellingApi } from '../api/fuelLoadingFuellingApi'
import { EFuelOrderStatus } from '../config/enums/EFuelOrderStatus'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
import { IFuelLoadingFuellingData } from '../config/interfaces/IFuelLoadingFuellingData'

const INTERVAL_MS = 1000
// Живой налив бака укладывается в пару минут; десять — это уже «колонка
// не отвечает», иначе экран крутится бесконечно.
const DEADLINE_MS = 10 * 60 * 1000

type Args = {
    /** Пока orderId не создан, опрашивать нечего */
    enabled: boolean
    orderId: string
    onComplete: (totals: IFuellingTotals) => void
    onError: (kind: EFuellingErrorKind, reason?: string) => void
}

// Поллинг статуса заказа. Живёт в lib, а не в компоненте: своих setInterval
// по месту в проекте не заводим (см. useCallcheckPolling). Запрос идёт через
// useFetchData, поэтому разлогин по 401 остаётся централизованным.
export const useFuellingPolling = ({
    enabled,
    orderId,
    onComplete,
    onError,
}: Args) => {
    const [status, setStatus] = useState<EFuelOrderStatus | null>(null)
    const [volume, setVolume] = useState(0)

    const { fetchData } = useFetchData<
        IFuelLoadingFuellingData,
        IFuelLoadingFuellingArgs
    >({
        apiCallback: fuelLoadingFuellingApi.getStatus,
        errorText: 'Не удалось получить статус налива',
    })

    const inFlightRef = useRef(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const cancelledRef = useRef(false)

    const fetchDataRef = useRef(fetchData)
    const onCompleteRef = useRef(onComplete)
    const onErrorRef = useRef(onError)
    fetchDataRef.current = fetchData
    onCompleteRef.current = onComplete
    onErrorRef.current = onError

    useEffect(() => {
        if (!enabled) return

        cancelledRef.current = false
        inFlightRef.current = false
        const startedAt = Date.now()

        const stop = () => {
            cancelledRef.current = true
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        const tick = async () => {
            if (inFlightRef.current || cancelledRef.current) return

            if (Date.now() - startedAt > DEADLINE_MS) {
                stop()
                onErrorRef.current(EFuellingErrorKind.TIMEOUT)
                return
            }

            inFlightRef.current = true
            await fetchDataRef.current({
                args: { orderId },
                hideToastOnError: true,
                disableSetLoading: true,
                afterDataCallback(data) {
                    if (cancelledRef.current) return
                    if (!data?.status) return

                    setStatus(data.status)
                    setVolume(data.volume)

                    switch (data.status) {
                        case EFuelOrderStatus.COMPLETED:
                            stop()
                            onCompleteRef.current({
                                volume: data.volume,
                                sum: data.sum,
                            })
                            break
                        case EFuelOrderStatus.EXPIRED:
                            stop()
                            onErrorRef.current(
                                EFuellingErrorKind.EXPIRED,
                                data.reason
                            )
                            break
                        case EFuelOrderStatus.STATION_CANCELED:
                            stop()
                            onErrorRef.current(
                                EFuellingErrorKind.STATION_CANCELED,
                                data.reason
                            )
                            break
                        case EFuelOrderStatus.USER_CANCELED:
                            stop()
                            onErrorRef.current(
                                EFuellingErrorKind.USER_CANCELED,
                                data.reason
                            )
                            break
                    }
                },
                finalyCallback() {
                    inFlightRef.current = false
                },
            })
        }

        intervalRef.current = setInterval(tick, INTERVAL_MS)
        tick()

        return stop
    }, [enabled, orderId])

    return { status, volume }
}
```

- [ ] **Step 6: Обновить `FuelLoadingFuellingWidget.tsx`**

```ts
import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { FuelPouringProgress } from '../../../../entities/FuelLoading/FuelPouringProgress'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    EFuellingErrorKind,
    FuelStore,
    IFuellingTotals,
} from '../../../../shared'
import {
    FUELLING_STATUS_PENDING_TEXT,
    FUELLING_STATUS_TEXTS,
} from '../config/constants/FUELLING_STATUS_TEXTS'
import { useFuellingPolling } from '../lib/useFuellingPolling'

type Props = {
    onEndFuelling: (totals: IFuellingTotals) => void
    onError: (kind: EFuellingErrorKind, reason?: string) => void
}

export const FuelLoadingFuellingWidget = memo(
    ({ onEndFuelling, onError }: Props) => {
        const router = useRouter()
        const { azs, column, fuelOption, liters, orderId } =
            FuelStore.useState()

        const { status, volume } = useFuellingPolling({
            enabled: Boolean(orderId),
            orderId: orderId ?? '',
            onComplete: onEndFuelling,
            onError,
        })

        const handleGoBack = useCallback(() => {
            router.back()
        }, [router])

        if (!azs || !column || !fuelOption || !liters || !orderId) return null

        const statusText = status
            ? (FUELLING_STATUS_TEXTS[status] ?? FUELLING_STATUS_PENDING_TEXT)
            : FUELLING_STATUS_PENDING_TEXT

        return (
            <>
                <StepHeader title="Идёт налив" onBack={handleGoBack} />
                <FuelPouringProgress
                    volume={volume}
                    target={liters}
                    statusText={statusText}
                    details={`Колонка ${column.id} · ${fuelOption.name} · не отходите от авто`}
                />
            </>
        )
    }
)
```

(проп `alarming` у `FuelPouringProgress` опциональный — просто больше не передаём, статуса «приостановлен» у Топаз нет).

- [ ] **Step 7: Проверить типы**

Run: `npx tsc --noEmit`
Expected: ошибки в файлах `widgets/FuelLoading/FuelLoadingFuellingWidget/*` больше не появляются.

- [ ] **Step 8: Commit**

```bash
git add src/widgets/FuelLoading/FuelLoadingFuellingWidget
git commit -m "refactor(fuel): поллинг статуса налива по orderId и EFuelOrderStatus"
```

---

### Task 8: Итоги налива

**Files:**
- Modify: `src/widgets/FuelLoading/FuelLoadingEndWidget/ui/FuelLoadingEndWidget.tsx`

**Interfaces:**
- Consumes: `FuelStore.state.{azs,column,fuelOption}` из Task 1.

- [ ] **Step 1: Обновить строку топлива**

Заменить:
```tsx
const { azs, column, trkType } = FuelStore.useState()
...
<ListRow
    title="Топливо"
    value={
        trkType && column
            ? `${trkType.name} · Колонка ${column.name}`
            : '—'
    }
/>
```
на:
```tsx
const { azs, column, fuelOption } = FuelStore.useState()
...
<ListRow
    title="Топливо"
    value={
        fuelOption && column
            ? `${fuelOption.name} · Колонка ${column.id}`
            : '—'
    }
/>
```
Остальной код файла (баланс, `divideNumber`, кнопка «На главную») не меняется.

- [ ] **Step 2: Проверить типы**

Run: `npx tsc --noEmit`
Expected: ошибки в этом файле больше не появляются.

- [ ] **Step 3: Commit**

```bash
git add src/widgets/FuelLoading/FuelLoadingEndWidget
git commit -m "refactor(fuel): итоги налива читают fuelOption вместо trkType"
```

---

### Task 9: Убрать сканирование колонки

**Files:**
- Delete: `src/widgets/Fuel/FuelScanBarcodeWidget/` (весь слайс)
- Modify: `src/shared/common/config/types/TFuelRoad.ts`
- Modify: `src/proccesses/Fuel/ui/Fuel.tsx`
- Modify: `src/widgets/Fuel/FuelMainWidget/ui/FuelMainWidget.tsx`
- Modify: `src/features/Fuel/MapFuelMainBlocks/ui/MapFuelMainBlocks.tsx`
- Modify: `src/widgets/Fuel/FuelMainWidget/config/constants/FUEL_MAIN_WIDGET_INFO_TEXTS.ts`

**Interfaces:**
- Produces: `TFuelRoad` без значения `'scan'`; `MapFuelMainBlocks` без пропа `onScanColumn`.

- [ ] **Step 1: Удалить слайс сканирования**

```bash
git rm -r src/widgets/Fuel/FuelScanBarcodeWidget
```

- [ ] **Step 2: Обновить `TFuelRoad.ts`**

```ts
// Шаги сценария заправки. Это подэкраны одного роута (вкладка «Топливо»),
// поэтому не ESCREENS: процесс переключает их локальным состоянием.
// Живёт в shared, потому что тип нужен и процессу, и виджетам шагов.
export type TFuelRoad = 'main' | 'selectAzsAndColumn' | 'selectTrkType' | 'selectLiters'
```

- [ ] **Step 3: Обновить `proccesses/Fuel/ui/Fuel.tsx`**

Убрать импорт и `case 'scan'`:

```tsx
import { memo, useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { FuelMainWidget } from '../../../widgets/Fuel/FuelMainWidget'
import { FuelSelectAzsAndColumnWidget } from '../../../widgets/Fuel/FuelSelectAzsAndColumnWidget'
import { FuelSelectLitersWidget } from '../../../widgets/Fuel/FuelSelectLitersWidget'
import { FuelSelectTrkTypeWidget } from '../../../widgets/Fuel/FuelSelectTrkTypeWidget'
import { TFuelRoad, useGetBalance } from '../../../shared'

type Props = {}

export const Fuel = memo((props: Props) => {
    const [road, setRoad] = useState<TFuelRoad>('main')
    const { fetchBalance } = useGetBalance()

    useFocusEffect(
        useCallback(() => {
            fetchBalance({ args: undefined, hideToastOnError: true })
        }, [])
    )

    switch (road) {
        case 'main':
            return <FuelMainWidget setRoad={setRoad} />
        case 'selectAzsAndColumn':
            return <FuelSelectAzsAndColumnWidget setRoad={setRoad} />
        case 'selectTrkType':
            return <FuelSelectTrkTypeWidget setRoad={setRoad} />
        case 'selectLiters':
            return <FuelSelectLitersWidget setRoad={setRoad} />
    }
})
```

- [ ] **Step 4: Обновить `FuelMainWidget.tsx`**

Убрать `handleScanColumn` и проп `onScanColumn`:

```tsx
import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { ScreenTitle } from '../../../../entities/ScreenTitle'
import { MapFuelMainBlocks } from '../../../../features/Fuel/MapFuelMainBlocks'
import { ESCREENS, SIZES, SPACING, TFuelRoad } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { FUEL_MAIN_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_MAIN_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
}

export const FuelMainWidget = memo(({ setRoad }: Props) => {
    const router = useRouter()

    const handleSelectColumn = useCallback(() => {
        setRoad('selectAzsAndColumn')
    }, [setRoad])

    const handleNeedHelp = useCallback(() => {
        router.navigate(ESCREENS.HELP)
    }, [router])

    const styles = StyleSheet.create({
        info: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <>
            <ScreenTitle title="Выберите метод" ml={SPACING.XS} />
            <MapFuelMainBlocks
                onNeedHelp={handleNeedHelp}
                onSelectColumn={handleSelectColumn}
            />
            <MPLayout mt={SPACING.SECTION}>
                <View style={styles.info}>
                    {FUEL_MAIN_WIDGET_INFO_TEXTS.map((info) => (
                        <InfoCard key={info.title} {...info} />
                    ))}
                </View>
            </MPLayout>
        </>
    )
})
```

- [ ] **Step 5: Обновить `MapFuelMainBlocks.tsx`**

Убрать плитку сканирования, оставить одну плитку «Нужна помощь» во всю ширину под герой-карточкой:

```tsx
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { FuelMethodTile } from '../../../../entities/Fuel/FuelMethodTile'
import { FuelMainHero } from '../../../../entities/Fuel/FuelMainHero'
import { SIZES, SPACING } from '../../../../shared'

type Props = {
    onSelectColumn: () => void
    onNeedHelp: () => void
}

// Раскладка макета: герой «Выбрать колонку», под ним плитка помощи
// (плитка сканирования убрана — Топаз не поддерживает идентификацию по QR).
export const MapFuelMainBlocks = memo(
    ({ onNeedHelp, onSelectColumn }: Props) => {
        const styles = StyleSheet.create({
            container: {
                gap: SPACING.MD * SIZES.PX,
            },
        })

        return (
            <View style={styles.container}>
                <FuelMainHero onPress={onSelectColumn} />
                <FuelMethodTile
                    icon="fuel_help"
                    variant="glass"
                    title="Нужна помощь"
                    subtitle="Подсказки, контакты"
                    onPress={onNeedHelp}
                />
            </View>
        )
    }
)
```

- [ ] **Step 6: Обновить `FUEL_MAIN_WIDGET_INFO_TEXTS.ts`**

Убрать карточку про QR-сканирование:

```ts
import { IInfoCard } from '../../../../../entities/InfoCard'

export const FUEL_MAIN_WIDGET_INFO_TEXTS: IInfoCard[] = [
    {
        title: 'Выберите метод определения колонки',
        info: 'Для начала налива выберите один из методов определения колонки.',
    },
    {
        title: 'Выберите колонку из списка',
        info: 'Вручную выберите нужную азс и номер колонки.',
    },
]
```

- [ ] **Step 7: Проверить полную компиляцию**

Run: `npx tsc --noEmit`
Expected: **ровно 5 ошибок** — та же базовая линия, что и до начала работы (см. `CLAUDE.md`). Если ошибок больше — найти файл, не обновлённый в задачах 1–9 (частый кандидат: пропущенное использование `trkType`/`column.name`/`column.device`/`azs.id` где-то за пределами тронутых файлов — перепроверить `grep -rn "trkType\|\.device\b" src`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(fuel): убрать сканирование QR — идентификация колонки только списком"
```

---

### Task 10: Финальная проверка и отчёт

**Files:**
- Create: `plans/topaz-fuelling-integration-progress.md`

- [ ] **Step 1: Полный прогон typecheck**

Run: `npx tsc --noEmit 2>&1 | tee /tmp/tsc-after.txt`
Сравнить с базовой линией из `CLAUDE.md` (5 ошибок: два роута, `WheelPicker` ×2, `TabBarWithBackground`). Набор ошибок должен посимвольно совпадать с базовым — если появились новые, вернуться к соответствующей задаче.

- [ ] **Step 2: Ручная сверка по чек-листу дизайна**

Пройтись по разделу «Затронутые файлы» в `plans/topaz-fuelling-integration-design.md` и отметить, что каждый пункт закрыт (изменён/удалён), особое внимание — открытым вопросам спеки (тест/прод контуры сервера, имя `SelectTrkTypeForm` — решено оставить как есть, см. Task 3).

- [ ] **Step 3: Написать отчёт в `plans/`**

Создать `plans/topaz-fuelling-integration-progress.md` по конвенции проекта (скилл `log-changes`): что сделано, какие файлы затронуты, результат `tsc --noEmit`, что не входит в объём (сервер и его протокол с Топаз), и что нельзя проверить без запущенного сервера/тестового контура Топаз (сам налив на реальной колонке).

- [ ] **Step 4: Commit**

```bash
git add plans/topaz-fuelling-integration-progress.md
git commit -m "docs(fuel): отчёт о переводе налива на Топаз"
```

**Не входит в объём этого плана:** реализация серверной части (эндпоинты `fuelling/*` и приём вебхуков от Топаз) — она вне этого репозитория; регистрация тестового/боевого окружения в личном кабинете Топаз (URL и IP уже даны пользователем); ручная проверка настоящего налива на dev-билде против тестового контура Топаз — доступна только после того, как сервер реализует новый контракт.
