// Палитра под макет «21 Век» (см. design/DESIGN_SPEC.md).
// COLORS и COLORS_DARK обязаны совпадать по набору ключей: в IThemeStore
// палитра типизирована как typeof COLORS, и тёмная присваивается в то же поле.
export const COLORS = {
    TEXT: {
        Primary: '#0A2033',
        Secondary: 'rgba(10,32,51,0.55)',
        Tertiary: 'rgba(10,32,51,0.35)',
        // Подпись кнопок на зелёном BRAND.Primary — остаётся белой.
        // Для лаймовых кнопок есть отдельный ACCENT.OnLime.
        Invert: '#FFFFFF',
        Error: '#FF6B54',
        Success: '#12C85B',
        Link: '#00C12A',
    },
    BACKGROUND: {
        // Фон светлой темы — градиент (см. AmbientBackground). Плоский Primary
        // равен его верхней точке: им красятся места вне градиентного слоя —
        // полоса safe-area, вебвью капчи, обводка ручки слайдера.
        Primary: '#EFF8E2',
        // Стопы фонового градиента макета: linear-gradient(165deg,
        // #EFF8E2 0%, #DCEFC6 50%, #C6E4A8 100%). Тремя отдельными токенами,
        // а не массивом: COLORS_DARK присваивается в поле типа typeof COLORS,
        // а кортеж для LinearGradient собирается на месте через `as const`.
        PrimaryGradientFrom: '#EFF8E2',
        PrimaryGradientMid: '#DCEFC6',
        PrimaryGradientTo: '#C6E4A8',
        Secondary: 'rgba(10,32,51,0.08)',
        Tertiary: 'rgba(255,255,255,0.55)',
        Invert: '#0A0E0B',
        // Подложка под QR-кодом. Белая в обеих темах: инвертированный код
        // (светлые модули на тёмном) читают не все кассовые сканеры.
        QrPlate: '#FFFFFF',
    },
    // Стеклянные поверхности. Primary — тихая/сгруппированная, Secondary — передний план.
    // Solid* — непрозрачные эквиваленты для Android и для blur={false}.
    // Surface — непрозрачная поверхность модалок и боттом-шитов: полупрозрачная
    // панель над затемнённым бэкдропом просвечивает и выглядит сломанной.
    GLASS: {
        // Стекло светлой темы стало заметно прозрачнее: сквозь него должны
        // просвечивать амбиентные блобы, поэтому рамка тоже светлая, а не
        // тёмная — иначе карточки читались бы как «обведённые».
        Primary: 'rgba(255,255,255,0.28)',
        Secondary: 'rgba(255,255,255,0.45)',
        Border: 'rgba(255,255,255,0.7)',
        // Непрозрачные подложки для Android — те же стёкла, предкомпозированные
        // на средней точке фонового градиента (#DCEFC6): фон по высоте экрана
        // меняется, и середина — лучшее одно приближение для всей высоты.
        SolidPrimary: '#E6F4D6',
        SolidSecondary: '#ECF6E0',
        Surface: '#F2F5EC',
        // Тонировки внутри плитки связанного аккаунта: круг под иконкой и
        // кружок «✕». Лежат поверх лайма или стекла, поэтому в обеих темах
        // одинаковы — как ACCENT.Lime и STATE.DestructiveSoft.
        TileAvatar: 'rgba(255,255,255,0.25)',
        TileClose: 'rgba(0,0,0,0.2)',
    },
    ACCENT: {
        Primary: '#00C12A',
        Lime: '#B8F53C',
        // Текст на лайме — всегда тёмный, в обеих темах.
        OnLime: '#0A0E0B',
        // Фон бейджа дизельного топлива. Как и лайм — тонировка бейджа,
        // от темы не зависит, поэтому в обеих палитрах одинаков.
        Diesel: '#9BD3FF',
        // Подложка под акцентной иконкой (круг в модалке перевода бонусов).
        // Тонировка поверх стекла, поэтому одинакова в обеих темах.
        PrimarySoft: 'rgba(0, 193, 42, 0.16)',
    },
    // Градиентные карточки макета (shared/GlassCard, варианты hero/lime/bonus)
    // и их собственная лаймовая рамка. Это тонировки поверх стекла, поэтому
    // в обеих темах одинаковы — как ACCENT.Lime.
    GRADIENT: {
        HeroFrom: 'rgba(0,193,42,0.28)',
        HeroMid: 'rgba(184,245,60,0.10)',
        LimeFrom: 'rgba(184,245,60,0.22)',
        BonusFrom: 'rgba(0,193,42,0.22)',
        Border: 'rgba(184,245,60,0.28)',
        // У карточки начислений рамка чуть слабее.
        BorderSoft: 'rgba(184,245,60,0.24)',
    },
    STATE: {
        Destructive: '#FF6B54',
        // Подложки под иконками статуса — тот же цвет с малой альфой.
        // Одинаковы в обеих темах: это тонировка поверх стекла.
        DestructiveSoft: 'rgba(255,107,84,0.15)',
        Positive: '#12C85B',
        PositiveSoft: 'rgba(18,200,91,0.15)',
        // Предупреждения в макете не нарисованы — цвет подобран к палитре.
        Warning: '#F5A623',
        WarningSoft: 'rgba(245,166,35,0.15)',
        Disabled: 'rgba(10,32,51,0.06)',
        // Выключенный трек свитча. Включённый — ACCENT.Primary.
        SwitchTrackOff: 'rgba(10,32,51,0.2)',
        // Ручка свитча белая в обеих темах — так в макете.
        SwitchKnob: '#FFFFFF',
        // Незаполненная часть трека слайдера. Стеклянным его сделать нельзя:
        // в светлой теме белая плёнка GLASS.Primary сливается с фоном.
        SliderTrack: 'rgba(10,32,51,0.22)',
        // Заливка и ручка слайдера. В тёмной теме это лайм из макета, в светлой
        // он сливается с фоном — там берём зелёный акцент палитры.
        SliderFill: '#00C12A',
    },
    // Сегменты пончика истории по типам операций (EHistoryItemType).
    // В макете (dc.html:300) секторов три и проценты в них выдуманы, а API
    // отдаёт до пяти типов — первые два цвета взяты из макета, остальные
    // подобраны к палитре. В обеих темах одинаковы: это заливки на стекле.
    HISTORY: {
        Fuel: '#00C12A',
        Coffee: '#B8F53C',
        PayBalance: '#9BD3FF',
        Transfer: '#FFB443',
        Cash: '#B47CFF',
    },
    // Цвета фоновых сфер (shared/AmbientBackground, dc.html:33–36).
    // From/Mid/To — стопы радиального градиента, Rim — внутренняя подсветка
    // края, Depth — внутренняя тень объёма, Drop — падающая тень.
    // Геометрия сфер одинакова в обеих темах и живёт в компоненте.
    AMBIENT: {
        Sphere1From: '#DBEFC0',
        Sphere1Mid: '#BEDF97',
        Sphere1To: '#A2CE77',
        Sphere1Rim: 'rgba(233,252,196,0.9)',
        Sphere1Depth: 'rgba(128,166,96,0.38)',
        Sphere1Drop: 'rgba(140,175,108,0.28)',

        Sphere2From: '#D5EBB6',
        Sphere2Mid: '#B7DA8D',
        Sphere2To: '#98C86B',
        Sphere2Rim: 'rgba(236,253,203,0.9)',
        Sphere2Depth: 'rgba(120,158,90,0.34)',
        Sphere2Drop: 'rgba(140,175,108,0.24)',

        Sphere3From: '#E1F3CA',
        Sphere3Mid: '#C5E3A0',
        Sphere3To: '#A9D27F',
        Sphere3Rim: 'rgba(239,254,208,0.9)',
        Sphere3Depth: 'rgba(128,166,96,0.32)',
        Sphere3Drop: 'rgba(140,175,108,0.22)',
    },
    EFFECTS: {
        BlurTint: 'light' as 'light' | 'dark',
        BlurIntensity: 20,
        // Скрим поверх фотографии промо-карточки. Лежит на фото, а не на фоне
        // экрана, поэтому в обеих палитрах одинаковый.
        ScrimFrom: 'rgba(10,14,11,0.05)',
        ScrimTo: 'rgba(10,14,11,0.85)',
        // Затемнение под модалкой. Одинаково в обеих темах: это затемнение
        // экрана, а не поверхность.
        Backdrop: 'rgba(0,0,0,0.49)',
        // Цвет тени под приподнятыми элементами. В светлой теме — чернила
        // палитры, а не чистый чёрный: так тень остаётся в её тоне.
        Shadow: '#0A2033',
    },
}

export const COLORS_DARK = {
    TEXT: {
        Primary: '#F2F6EE',
        Secondary: 'rgba(242,246,238,0.55)',
        Tertiary: 'rgba(242,246,238,0.35)',
        Invert: '#FFFFFF',
        Error: '#FF6B54',
        Success: '#12C85B',
        Link: '#00C12A',
    },
    BACKGROUND: {
        Primary: '#0A0E0B',
        // В тёмной теме макета фон плоский — все три стопа совпадают,
        // градиентный слой AmbientBackground рисует ровный #0A0E0B.
        PrimaryGradientFrom: '#0A0E0B',
        PrimaryGradientMid: '#0A0E0B',
        PrimaryGradientTo: '#0A0E0B',
        Secondary: 'rgba(255,255,255,0.10)',
        Tertiary: 'rgba(255,255,255,0.06)',
        Invert: '#F2F6EE',
        QrPlate: '#FFFFFF',
    },
    GLASS: {
        Primary: 'rgba(255,255,255,0.06)',
        Secondary: 'rgba(255,255,255,0.11)',
        Border: 'rgba(255,255,255,0.10)',
        SolidPrimary: '#12170F',
        SolidSecondary: '#1A1F17',
        Surface: '#141A15',
        TileAvatar: 'rgba(255,255,255,0.25)',
        TileClose: 'rgba(0,0,0,0.2)',
    },
    ACCENT: {
        Primary: '#00C12A',
        Lime: '#B8F53C',
        OnLime: '#0A0E0B',
        Diesel: '#9BD3FF',
        PrimarySoft: 'rgba(0, 193, 42, 0.16)',
    },
    GRADIENT: {
        HeroFrom: 'rgba(0,193,42,0.28)',
        HeroMid: 'rgba(184,245,60,0.10)',
        LimeFrom: 'rgba(184,245,60,0.22)',
        BonusFrom: 'rgba(0,193,42,0.22)',
        Border: 'rgba(184,245,60,0.28)',
        BorderSoft: 'rgba(184,245,60,0.24)',
    },
    STATE: {
        Destructive: '#FF6B54',
        // Подложки под иконками статуса — тот же цвет с малой альфой.
        // Одинаковы в обеих темах: это тонировка поверх стекла.
        DestructiveSoft: 'rgba(255,107,84,0.15)',
        Positive: '#12C85B',
        PositiveSoft: 'rgba(18,200,91,0.15)',
        // Предупреждения в макете не нарисованы — цвет подобран к палитре.
        Warning: '#F5A623',
        WarningSoft: 'rgba(245,166,35,0.15)',
        Disabled: 'rgba(242,246,238,0.10)',
        // В макете свитч в тёмной теме всегда включён — цвет выключенного
        // трека подобран к палитре, макетного значения для него нет.
        SwitchTrackOff: 'rgba(255,255,255,0.2)',
        SwitchKnob: '#FFFFFF',
        SliderTrack: 'rgba(255,255,255,0.14)',
        SliderFill: '#B8F53C',
    },
    HISTORY: {
        Fuel: '#00C12A',
        Coffee: '#B8F53C',
        PayBalance: '#9BD3FF',
        Transfer: '#FFB443',
        Cash: '#B47CFF',
    },
    // Те же сферы в тёмной теме: почти чёрная зелень с лаймовой подсветкой края.
    AMBIENT: {
        Sphere1From: '#20361A',
        Sphere1Mid: '#152510',
        Sphere1To: '#0B140A',
        Sphere1Rim: 'rgba(184,245,60,0.5)',
        Sphere1Depth: 'rgba(0,0,0,0.6)',
        Sphere1Drop: 'rgba(0,0,0,0.5)',

        Sphere2From: '#1D3218',
        Sphere2Mid: '#13220F',
        Sphere2To: '#090F08',
        Sphere2Rim: 'rgba(184,245,60,0.45)',
        Sphere2Depth: 'rgba(0,0,0,0.6)',
        Sphere2Drop: 'rgba(0,0,0,0.45)',

        Sphere3From: '#233A1C',
        Sphere3Mid: '#162812',
        Sphere3To: '#0A1209',
        Sphere3Rim: 'rgba(184,245,60,0.42)',
        Sphere3Depth: 'rgba(0,0,0,0.55)',
        Sphere3Drop: 'rgba(0,0,0,0.4)',
    },
    EFFECTS: {
        BlurTint: 'dark' as 'light' | 'dark',
        BlurIntensity: 20,
        ScrimFrom: 'rgba(10,14,11,0.05)',
        ScrimTo: 'rgba(10,14,11,0.85)',
        Backdrop: 'rgba(0,0,0,0.49)',
        Shadow: '#000000',
    },
}
