# Callcheck — третий способ авторизации/регистрации

## Что сделано

### Контекст

Добавлен третий способ входа в мобильное приложение: **callcheck** — пользователь сам звонит на номер, который выдаёт sms.ru. Звонок сбрасывается (бесплатно для клиента), мобилка поллит status-эндпоинт до подтверждения.

Выбор способа управляется бэкендом через `/v2/auth_methods/` — возвращает массив в порядке приоритета (например, `["callcheck", "sms"]`). Мобилка идёт по `methods[0]`, `methods[1]` — запасной.

API-документация: `mobile_callcheck_api.md` (корень проекта).

---

### Новые файлы

| Файл | Описание |
|------|----------|
| `src/shared/common/config/enums/EAuthMethod.ts` | Enum способов авторизации: `Call`, `Sms`, `Callcheck` |
| `src/shared/common/api/authMethodsApi.ts` | GET `v2/auth_methods/` — получение списка доступных способов |
| `src/features/SendCallcheckWait/index.ts` | Экспорт feature |
| `src/features/SendCallcheckWait/api/callcheckApi.ts` | API: `initLogin`, `pollLoginStatus`, `initRegistration`, `pollRegistrationStatus` |
| `src/features/SendCallcheckWait/config/interfaces/ICallcheckInitResponse.ts` | Типы ответов инициации (login/registration) |
| `src/features/SendCallcheckWait/config/interfaces/ICallcheckStatusResponse.ts` | Типы ответов поллинга (waiting / success) |
| `src/features/SendCallcheckWait/lib/parseCallcheckError.ts` | Маппер plain-text ошибок бэка → enum `ECallcheckErrorKind` + `getCallcheckErrorText()` |
| `src/features/SendCallcheckWait/lib/useCallcheckPolling.ts` | Хук поллинга: `setInterval` 2.5с, защита от гонки (`inFlight`), cleanup на unmount |
| `src/features/SendCallcheckWait/ui/SendCallcheckWait.tsx` | Экран «Позвоните на номер X»: `tel:` deep-link, таймер 5 мин, кнопка fallback (через 60 сек) |

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `src/shared/index.ts` | Добавлены экспорты `EAuthMethod` и `authMethodsApi` |
| `src/widgets/LoginWidget/ui/LoginWidget.tsx` | Загрузка `/auth_methods/` на mount (блокирующий лоадер, дефолт `[call, sms]` при ошибке); роутинг между `SendSmsCallCodeForm` и `SendCallcheckWait` по `currentMethod`; `handleCallcheckRetry` для повторной капчи |
| `src/widgets/RegistrationWidget/ui/RegistrationWidget.tsx` | Аналогично LoginWidget, с передачей `name`/`surname` |

---

### Архитектура

```
LoginWidget / RegistrationWidget
    ↓ mount → GET /auth_methods/ (блокирующий лоадер)
    ↓ methods = ["callcheck", "sms"] | ["call", "sms"] | ...
    ↓ currentMethod = methods[0], fallbackMethod = methods[1]
    ↓ ввод телефона + капча
    ↓ роутинг:
        callcheck → SendCallcheckWait (init + polling внутри)
        call/sms  → SendSmsCallCodeForm (существующий)
    ↓ fallback: кнопка разблокируется через 60с (callcheck) / 30с (call)
```

**SendCallcheckWait — жизненный цикл:**
1. Mount → `initLoginCallcheck` / `initRegistrationCallcheck` → получаем `check_id` + `call_phone`
2. Показываем номер + кнопка «Позвонить» (`Linking.openURL('tel:...')`)
3. Запускаем таймер (1с) + поллинг (2.5с)
4. Поллинг вернул `{token, name}` → `onSuccess` → сохраняем в Zustand → Home
5. Таймаут 5 мин или ошибка `Истекло время ожидания` → экран «Попробовать ещё раз» + fallback
6. «Попробовать ещё раз» → `onRetry` → виджет перенаправляет на капчу (свежий токен)
7. Fallback → `onFallback` → виджет переключает на SMS/call

---

### Баг-фиксы (после первоначальной реализации)

**Проблема:** «Капча не пройдена» при нажатии «Попробовать ещё раз» после expired.
**Причина:** Yandex SmartCaptcha отдаёт одноразовый токен; повторный init с тем же токеном невалиден.
**Фикс:** Добавлен проп `onRetry` в `SendCallcheckWait`. Кнопка «Попробовать ещё раз» вызывает `onRetry` (вместо локального `initiate`). В виджетах `handleCallcheckRetry` сбрасывает `captchaValue` и направляет на экран капчи.

**Проблема:** «Мы не получили ваш звонок» при регистрации (хотя звонок прошёл).
**Причина:** Бэкенд возвращает `Не удалось создать пользователя` (sms.ru подтвердил, но `insert_client` упал). Это backend-баг — мобилка отображает корректно (показывает тост + expired-экран), но текст expired-экрана вводит в заблуждение.
**Статус:** Передано бэкенд-разработчику.

---

### Обработка ошибок

**Инициация (init):**
- `Капча не пройдена` → тост + возврат на phoneInput
- `Клиент не найден` / `Пользователь уже зарегистрирован` → тост + возврат на phoneInput
- `Не удалось инициировать звонок` → тост + экран initError (Попробовать / Назад)

**Поллинг (status):**
- `Истекло время ожидания` / `Сессия не найдена` → expired-экран
- `Не удалось получить статус` / сетевая ошибка → молча повторяем
- Прочие (`Не удалось создать пользователя` и т.д.) → тост + expired-экран
- Успех `{token, name}` → сохраняем, переходим в Home

**Fallback при ошибке `/auth_methods/`:** дефолт `["call", "sms"]` — старый флоу работает без изменений.

---

### Не затронуто (YAGNI)

- Кэширование `/auth_methods/` в AsyncStorage
- UI ручного выбора способа (выбор полностью бэк-driven)
- Существующий 30-сек fallback в `SendPhoneCallCode`
- Автотесты (в проекте их нет для auth-флоу)

### Верификация

- `npx tsc --noEmit` — новых ошибок типов не добавлено (число ошибок уменьшилось: 214→209, все оставшиеся — pre-existing)
- Диагностические логи `[callcheck-poll]` — добавлялись временно, убраны перед билдом
