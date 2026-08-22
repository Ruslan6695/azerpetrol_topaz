// Тайминги и кривые движения из макета «21 Век» (design/DESIGN_SPEC.md, «Анимации»).
// Здесь только числа и контрольные точки: одни и те же кривые нужны двум разным
// API реанимейтеда — Easing.bezier для withTiming и cubicBezier для CSS-транзишенов.
// Готовые функции собираются в common/config/lib/motion/easing, а этот файл
// намеренно оставлен без импортов: его тянет корневой бочонок shared.
export const MOTION = {
    // --- Из макета ---
    // screenIn: animation: screenIn .38s на 31 экране прототипа.
    SCREEN_IN: 380,
    // Тот же screenIn на логине и регистрации — там .4s.
    AUTH_IN: 400,
    // Сегмент-контрол: transition: background .2s.
    SEGMENT: 200,
    // Нижний таб-бар: transition: background .25s + filter .25s.
    TAB: 250,
    // Смена темы: transition: background .4s на корневом фрейме.
    THEME: 400,
    // Отклик нажатия: transition: transform .15s. Значение переиспользует
    // PRESS_DURATION в PRESS_SCALE.ts, чтобы источник правды был один.
    PRESS: 150,

    // --- Сверх макета ---
    // В прототипе этого нет: там скелетон сменяется контентом одним кадром,
    // а модалки появляются без анимации. Это ограничение HTML-прототипа.
    CONTENT_IN: 220,
    BACKDROP: 200,
    MODAL_IN: 220,
    MODAL_OUT: 160,
    SHEET_IN: 300,
    SHEET_OUT: 220,
    // «Поп» круга в CenteredState и ConfirmDialog.
    POP: 320,
    // Отрисовка дуг кольца в DonutChart.
    ARC_DRAW: 700,
    // Шаг каскада списка — задержка на каждый следующий элемент.
    STAGGER_STEP: 40,
} as const

// Каскад списков: сколько первых элементов вообще получает задержку и как долго
// после маунта списка каскад считается «живым». Окно нужно, чтобы догруженные
// страницы и доскролленные ячейки появлялись сразу — см. shared/Stagger.
export const STAGGER = {
    MAX_ITEMS: 8,
    WINDOW: 400,
} as const

// Контрольные точки cubic-bezier из макета.
export const CURVE = {
    // screenIn: cubic-bezier(.2,.8,.25,1).
    SCREEN: [0.2, 0.8, 0.25, 1],
    // Ручка свитча: cubic-bezier(.3,1.4,.5,1) — единственная кривая макета
    // с перелётом за единицу. Ей же анимируется «поп» круга.
    SPRINGY: [0.3, 1.4, 0.5, 1],
    // CSS ease — дефолт всех transition макета, где easing не задан явно.
    EASE: [0.25, 0.1, 0.25, 1],
} as const
