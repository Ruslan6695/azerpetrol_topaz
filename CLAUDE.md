# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Азерпетрол — мобильное приложение АЗС (fuel/loyalty app): баланс, заправка, кофе-бонусы, акции, переводы.
Expo SDK 54 / React Native 0.81 / React 19, expo-router, TypeScript strict, Zustand. New Architecture включена.

Тексты интерфейса, комментарии и отчёты в `plans/` — на русском.

Идёт редизайн под макет **«21 Век»** ([Claude Design](https://claude.ai/design/p/58beacf8-4804-4477-9e9f-f9991cf19ca6)): dark-first глассморфизм, лаймовый акцент, Manrope 600/700/800. Локальная копия макета — [design/21vek-app.dc.html](design/21vek-app.dc.html), выжимка с токенами и описью экранов — [design/DESIGN_SPEC.md](design/DESIGN_SPEC.md), правила работы с ним — [.claude/rules/design.md](.claude/rules/design.md).

## Commands

```bash
yarn start          # expo start (dev-сервер)
yarn ios / android  # start + запуск на устройстве
npx tsc --noEmit    # типчек
eas build --profile development|preview|production -p ios|android
```

- Приложение использует `expo-dev-client` и нативные модули (камера, геолокация, контакты, пуши) — **в Expo Go не запустится**, нужен dev-билд.
- Тестов, линтера и lint-скрипта в проекте нет. Не заявляй, что тесты прошли — их не существует.
- `npx tsc --noEmit` сейчас даёт ~39 предсуществующих ошибок. Сравнивай состояние до/после своего изменения, а не жди чистого прогона.
- Нативный конфиг — [app.config.ts](app.config.ts) (действующий; `app.json` остался от старой схемы).

## Rules

Правила проекта разбиты по темам в [.claude/rules/](.claude/rules/). Перед изменением кода читай те, что относятся к задаче:

| Файл | О чём |
|------|-------|
| [architecture.md](.claude/rules/architecture.md) | FSD-слои, на каком слое что живёт, структура слайса |
| [imports.md](.claude/rules/imports.md) | Относительные пути, бочонки, `shared/index.ts` |
| [state.md](.claude/rules/state.md) | Zustand + immer + `createSelectorHooks`, AsyncStorage |
| [data-fetching.md](.claude/rules/data-fetching.md) | `useFetchData` / `useFetchStoreData` / `useSendFetch`, формат `api/` |
| [navigation.md](.claude/rules/navigation.md) | expo-router, `ESCREENS`, добавление экрана |
| [styling.md](.claude/rules/styling.md) | Тема и `COLORS`, `SIZES.PX`, `Typography`, `MPLayout`, SVG |
| [design.md](.claude/rules/design.md) | Макет «21 Век»: где лежит, соответствие макет ↔ токены, чего нет в RN, порядок переделки экрана |
| [auth.md](.claude/rules/auth.md) | `auth_methods`, callcheck/sms/call, капча, токен |
| [dependencies.md](.claude/rules/dependencies.md) | Подключение библиотек: **context7 до кода**, `expo install`, обёртка в `shared/` |
| [code-style.md](.claude/rules/code-style.md) | Prettier, именование, `memo`, типизация |

Проверить изменения на соответствие этим правилам: скилл `project-review`.

## Agents

- `design-reader` ([.claude/agents/design-reader.md](.claude/agents/design-reader.md)) — чтец макета «21 Век»: разбирает `design/21vek-app.dc.html` и выдаёт спеку экрана сразу в токенах проекта. Только читает.
- `redesign-scout` ([.claude/agents/redesign-scout.md](.claude/agents/redesign-scout.md)) — разведка перед передизайном: где что верстается, что меняется централизованно (палитра / `Typography` / `SIZES`), что по месту, какой blast radius. Только читает.

Переделка экрана — сначала `design-reader` («как должно быть»), потом `redesign-scout` («как устроено сейчас»).
- `library-integrator` ([.claude/agents/library-integrator.md](.claude/agents/library-integrator.md)) — подключение сторонних библиотек: документация через **context7** до кода, проверка New Architecture / SDK 54, `expo install`, обёртка в `shared/`.

⚠️ Плагин **context7** сейчас установлен только для проекта `BackOffice-Front`. Чтобы правило работало здесь, установи его и в этом проекте: `/plugin install context7@claude-plugins-official`.

## Misc

- `plans/` — русскоязычные отчёты о проделанной работе (скилл `log-changes`).
- Репозиторий проиндексирован CodeGraph — для поиска кода предпочитай `codegraph_explore` вместо grep.
