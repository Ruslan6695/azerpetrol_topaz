// Палитра под макет «21 Век» (см. design/DESIGN_SPEC.md).
// COLORS и COLORS_DARK обязаны совпадать по набору ключей: в IThemeStore
// палитра типизирована как typeof COLORS, и тёмная присваивается в то же поле.
export const COLORS = {
    BRAND: {
        Primary: '#00C12A',
        Secondary: '#62D82A',
        Tertiary: '#9BB83D',
    },

    SUCCESS: {
        Primary: '#12C85B',
        Secondary: '#59D88C',
    },
    ERROR: {
        Primary: '#FF6B54',
        Secondary: '#FF8271',
    },
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
    Icon: {
        Primary: '#0A2033',
        Secondary: 'rgba(10,32,51,0.55)',
        Tertiary: '#C2C7CC',
        Invert: '#FFFFFF',
        Error: '#FF6B54',
        Success: '#12C85B',
        Link: '#9FBB3D',
    },
    BACKGROUND: {
        Primary: '#E4E9DD',
        Secondary: 'rgba(10,32,51,0.08)',
        Tertiary: 'rgba(255,255,255,0.55)',
        Invert: '#0A0E0B',
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
        // на BACKGROUND.Primary (#E4E9DD).
        SolidPrimary: '#EBEFE6',
        SolidSecondary: '#F0F3EC',
        Surface: '#F2F5EC',
    },
    ACCENT: {
        Primary: '#00C12A',
        Lime: '#B8F53C',
        // Текст на лайме — всегда тёмный, в обеих темах.
        OnLime: '#0A0E0B',
        // Подложка под акцентной иконкой (круг в модалке перевода бонусов).
        // Тонировка поверх стекла, поэтому одинакова в обеих темах.
        PrimarySoft: 'rgba(0, 193, 42, 0.16)',
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
    },
    // Цвета фоновых блобов (shared/AmbientBackground).
    AMBIENT: {
        BlobA: '#00C12A',
        BlobAOpacity: 0.26,
        BlobB: '#B8F53C',
        BlobBOpacity: 0.3,
        BlobC: '#00C12A',
        BlobCOpacity: 0.22,
    },
    EFFECTS: {
        BlurTint: 'light' as 'light' | 'dark',
        BlurIntensity: 20,
        // Скрим поверх фотографии промо-карточки. Лежит на фото, а не на фоне
        // экрана, поэтому в обеих палитрах одинаковый.
        ScrimFrom: 'rgba(10,14,11,0.05)',
        ScrimTo: 'rgba(10,14,11,0.85)',
    },
}

export const COLORS_DARK = {
    BRAND: {
        Primary: '#00C12A',
        Secondary: '#62D82A',
        Tertiary: '#9BB83D',
    },

    SUCCESS: {
        Primary: '#12C85B',
        Secondary: '#59D88C',
    },
    ERROR: {
        Primary: '#FF6B54',
        Secondary: '#FF8271',
    },
    TEXT: {
        Primary: '#F2F6EE',
        Secondary: 'rgba(242,246,238,0.55)',
        Tertiary: 'rgba(242,246,238,0.35)',
        Invert: '#FFFFFF',
        Error: '#FF6B54',
        Success: '#12C85B',
        Link: '#00C12A',
    },
    Icon: {
        Primary: '#F2F6EE',
        Secondary: 'rgba(242,246,238,0.55)',
        Tertiary: '#C2C7CC',
        Invert: '#FFFFFF',
        Error: '#FF6B54',
        Success: '#12C85B',
        Link: '#369500',
    },
    BACKGROUND: {
        Primary: '#0A0E0B',
        Secondary: 'rgba(255,255,255,0.10)',
        Tertiary: 'rgba(255,255,255,0.06)',
        Invert: '#F2F6EE',
    },
    GLASS: {
        Primary: 'rgba(255,255,255,0.06)',
        Secondary: 'rgba(255,255,255,0.11)',
        Border: 'rgba(255,255,255,0.10)',
        SolidPrimary: '#12170F',
        SolidSecondary: '#1A1F17',
        Surface: '#141A15',
    },
    ACCENT: {
        Primary: '#00C12A',
        Lime: '#B8F53C',
        OnLime: '#0A0E0B',
        PrimarySoft: 'rgba(0, 193, 42, 0.16)',
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
    },
    AMBIENT: {
        BlobA: '#00C12A',
        BlobAOpacity: 0.42,
        BlobB: '#B8F53C',
        BlobBOpacity: 0.34,
        BlobC: '#00C12A',
        BlobCOpacity: 0.26,
    },
    EFFECTS: {
        BlurTint: 'dark' as 'light' | 'dark',
        BlurIntensity: 20,
        ScrimFrom: 'rgba(10,14,11,0.05)',
        ScrimTo: 'rgba(10,14,11,0.85)',
    },
}
