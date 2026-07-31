// Шкала отступов из макета «21 Век». Домножается на SIZES.PX на месте:
//     padding: SPACING.XL * SIZES.PX
export const SPACING = {
    XXS: 3,
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 14,
    XL: 16,
    SCREEN: 20,
    XXL: 24,
    SECTION: 32,
    // Нижний отступ контента под плавающим таб-баром.
    TABBAR_CLEARANCE: 120,
} as const
