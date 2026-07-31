# Импорты и public API

## Правило 1. Только относительные пути

Алиасов путей в проекте нет ([tsconfig.json](../../tsconfig.json) их не задаёт). Пишем относительные пути, какой бы длины они ни получились.

❌ `import { Typography } from '@/shared/Typography'`
✅ `import { Typography } from '../../../shared/Typography'`

## Правило 2. Импорт слайса — через его `index.ts`

✅ `import { SelectLiters } from '../../features/Fuel/SelectLiters'`
❌ `import { SelectLiters } from '../../features/Fuel/SelectLiters/ui/SelectLiters'`

Исключение уже есть в коде (`shared/Skeleton/ui/Skeletons`) — это долг, а не образец; новые импорты так не пишем.

## Правило 3. Невизуальный shared — через корневой бочонок

Стора, хуки, константы, енамы, типы, axios-инстанс реэкспортируются из [src/shared/index.ts](../../src/shared/index.ts) и импортируются одной строкой:

```ts
import { AppStore, ESCREENS, SIZES, ThemeStore, UserStore, useFetchData } from '../../shared'
```

**Всё новое, что добавляется в `src/shared/common/`, обязано быть дописано в `src/shared/index.ts`.** Иначе оно окажется недоступно в принятом стиле импорта.

## Правило 4. UI-компоненты shared — по своей папке

Компоненты UI-кита в корневой бочонок **не** входят. Их импортируем по папке:

```ts
import { Typography } from '../../shared/Typography'
import { CustomButton } from '../../shared/CustomButton'
import { showError } from '../../shared/ToastComponent'
```

## Правило 5. Направление импортов

Импорт разрешён только «вниз» по слоям (см. [architecture.md](architecture.md)). `entities/` не импортирует `features/`, `features/` не импортирует `widgets/`, `shared/` не импортирует ничего из вышележащих слоёв.
