// Радиусы из макета «21 Век» (design/DESIGN_SPEC.md, раздел «Радиусы»).
// Все значения, кроме PILL, домножаются на SIZES.PX на месте применения:
//     borderRadius: RADII.CARD * SIZES.PX
// PILL используется сырым — это «бесконечный» радиус, масштабировать его нечем.
export const RADII = {
    PILL: 999,
    SHEET: 36,
    HERO: 32,
    TABBAR: 30,
    HERO_SM: 28,
    CARD: 24,
    TILE: 22,
    ROW: 20,
    INPUT: 16,
    BADGE: 14,
    CHIP_SM: 12,
} as const
