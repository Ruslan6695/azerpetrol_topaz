# Авторизация

## Схема

`GET /v2/auth_methods/` возвращает способы в порядке приоритета: `callcheck` | `sms` | `call` (енам `EAuthMethod`).

```
LoginWidget / RegistrationWidget
    → на mount грузят auth_methods (блокирующий лоадер, дефолт [call, sms] при ошибке)
    → currentMethod = methods[0], fallbackMethod = methods[1]
    → ввод телефона + капча
    → callcheck  → features/SendCallcheckWait  (клиент сам звонит, приложение поллит статус)
      call/sms   → features/SendSmsCallCodeForm
    → fallback-кнопка разблокируется через 60с (callcheck) / 30с (call)
```

Подробный разбор и история багов — [plans/callcheck-implementation.md](../../plans/callcheck-implementation.md).

## Правило 1. Способ входа выбирает бэкенд

Порядок способов не хардкодим и не меняем на клиенте — идём строго по `methods[0]`, `methods[1]`. Новый способ = новое значение в `EAuthMethod` + ветка роутинга в обоих виджетах (`LoginWidget` и `RegistrationWidget`), они всегда правятся парой.

## Правило 2. Токен капчи одноразовый

Yandex SmartCaptcha отдаёт токен на один запрос. Любой ретрай (кнопка «Попробовать ещё раз», повторная инициация) обязан сбросить `captchaValue` и провести пользователя через капчу заново — переиспользование токена даёт «Капча не пройдена».

## Правило 3. Поллинг статуса

Поллинг живёт в `features/SendCallcheckWait/lib/useCallcheckPolling.ts`: интервал 2.5с, защита от гонки флагом `inFlight`, обязательный cleanup на unmount, общий таймаут 5 минут. Свои `setInterval` в компонентах не заводим.

## Правило 4. Токен и разлогин

- Успех → `UserStore.setUser({ name, token })`, что само пишет в AsyncStorage (`EAsyncStoreKeys.NAME`, `EAsyncStoreKeys.TOKEN`).
- Обновлённый токен с бэка → `UserStore.setToken`.
- Разлогин по 401 делают хуки запросов централизованно (см. [data-fetching.md](data-fetching.md)) — руками не дублируем.

## Правило 5. Текст ошибок бэка

Бэкенд отдаёт ошибки plain-текстом. Разбор — через маппер `parseCallcheckError` в енам `ECallcheckErrorKind` + `getCallcheckErrorText()`. Сравнений со строками ошибок по месту не пишем.
