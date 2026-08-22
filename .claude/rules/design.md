# Дизайн — макет «21 Век»

## Где лежит дизайн

| Что | Где |
|-----|-----|
| Проект в Claude Design | https://claude.ai/design/p/58beacf8-4804-4477-9e9f-f9991cf19ca6 |
| `projectId` для MCP | `58beacf8-4804-4477-9e9f-f9991cf19ca6` |
| Основной файл макета | `21 Век - Приложение.dc.html` — **единственный источник истины** |
| Локальная копия | [design/21vek-app.dc.html](../../design/21vek-app.dc.html) |
| Выжимка (токены, компоненты, опись экранов) | [design/DESIGN_SPEC.md](../../design/DESIGN_SPEC.md) |

В проекте Claude Design рядом лежат `Новый дизайн 21 Век.dc.html` и `Текущий дизайн.dc.html` — вспомогательные, на них не ориентируемся.

Обновить локальную копию, когда дизайнер поменял макет:

```
DesignSync get_file { projectId: "58beacf8-4804-4477-9e9f-f9991cf19ca6",
                      path: "21 Век - Приложение.dc.html" }
```
и переписать `design/21vek-app.dc.html` + пересобрать затронутые разделы `DESIGN_SPEC.md`.

## Правило 1. Порядок работы над экраном

Переделка внешнего вида экрана — **два агента подряд, потом правки**:

1. `design-reader` — «как должно быть»: читает макет и выдаёт спеку экрана уже в терминах кода (`RADII.*`, `SPACING.*`, `COLORS.*`, `Typography type=`, `<Icon name=…>`, `ESCREENS.*`).
2. `redesign-scout` — «как устроено сейчас»: карта слоёв FSD, что правится централизованно, что по месту, какой blast radius.
3. Правки по пересечению двух отчётов.

Пропускать шаг 1 нельзя: без него значения макета попадают в код сырыми хексами мимо палитры.

## Правило 2. Значения макета переводим в токены, а не копируем

CSS-переменные макета соответствуют палитре из [COLORS.ts](../../src/shared/common/config/constants/COLORS.ts):

| Макет | Код |
|-------|-----|
| `--bg` | `COLORS.BACKGROUND.Primary` |
| `--tx` | `COLORS.TEXT.Primary` |
| `--tx2` | `COLORS.TEXT.Secondary` |
| `--glass` | `COLORS.GLASS.Primary` |
| `--glass2` | `COLORS.GLASS.Secondary` |
| `--bord` | `COLORS.GLASS.Border` |
| `--acc` | `COLORS.ACCENT.Primary` |
| `--lime` | `COLORS.ACCENT.Lime` |
| текст на лайме (`#0A0E0B`) | `COLORS.ACCENT.OnLime` |
| `#FF6B54` | `COLORS.STATE.Destructive` |
| `#12C85B` | `COLORS.STATE.Positive` |
| `--icf` (фильтр тонировки) | проп `color` у `<Icon>`, **не** фильтр |
| фон под модалкой/боттом-шитом | `COLORS.GLASS.Surface` (непрозрачный) |
| поверхность на Android без блюра | `COLORS.GLASS.SolidPrimary` / `SolidSecondary` |

Радиусы — из [RADII.ts](../../src/shared/common/config/constants/RADII.ts), отступы — из [SPACING.ts](../../src/shared/common/config/constants/SPACING.ts), масштаб нажатия — из [PRESS_SCALE.ts](../../src/shared/common/config/constants/PRESS_SCALE.ts). Всё, кроме `RADII.PILL`, домножается на `SIZES.PX` на месте.

Шрифтовая лестница макета → типы `Typography`:

| Вес макета | Типы |
|-----------|------|
| 800 | `h1 h2 h3 h4 h5 h6`, `num20 num18 num17 num16 num15 num12` |
| 700 | `rowTitle`, `label14`, `label13` |
| 600 | `body14 body13 body125`, `caption12 caption11 caption10`, `tabLabel`, `eyebrow` |

Старая лестница (`display*`, `headline*`, `body(Large|Medium|Small)`, `bodyAccent*`, `caption`, `captionAccent`) **удалена** — непеределанных экранов не осталось. Проп `type` обязателен, дефолта нет.

## Правило 3. Чего в React Native нет

Макет — это HTML/CSS. Прямых аналогов нет у:

| В макете | В коде |
|----------|--------|
| `backdrop-filter: blur()` | только через `shared/GlassCard` (он один знает про `BlurView` и про фоллбэк) |
| `filter: brightness()/invert()/grayscale()` | проп `color` у `<Icon>` (иконки нормализованы на `currentColor`) |
| `display: grid` | `flexDirection: 'row'` + `flexWrap: 'wrap'`, ширина элемента через `SIZES.WIDTH()` |
| `radial-gradient` | `react-native-svg` (`<RadialGradient>`), см. `shared/AmbientBackground` |
| `conic-gradient` (пончик истории) | `shared/DonutChart` — дуги на `react-native-svg` |
| `linear-gradient` | `expo-linear-gradient` |
| `letter-spacing` в `font` | отдельное поле `letterSpacing` (тоже `* SIZES.PX`) |
| `:active { transform: scale() }` | `shared/PressableScale` с `PRESS_SCALE.*` |
| `position: absolute; inset: 0` | `StyleSheet.absoluteFill` |

## Правило 4. Макет нарисован на фейковых данных

В прототипе зашиты выдуманные баланс, история, список АЗС, меню кофе, контакты и цены. Это **иллюстрация вёрстки, а не контракт бэкенда**. Экран верстаем под данные, которые реально отдаёт API (см. [data-fetching.md](data-fetching.md)); чего в API нет — выносим в отчёт как расхождение, а не придумываем эндпоинт.

Так же и с экранами, которых в приложении пока нет (Настройки с тумблерами, Удаление аккаунта, сканер кофемашины): верстаем по макету, действия оставляем заглушками и помечаем в `plans/`.

## Правило 5. Обе темы обязательны

У макета есть dark и light. Любая новая вёрстка проверяется в обеих — переключатель в Профиле (`features/ChangeColorTheme`). Токенов, существующих только в одной палитре, не бывает: `COLORS` и `COLORS_DARK` всегда идентичны по набору ключей (в `IThemeStore` палитра типизирована как `typeof COLORS`).
