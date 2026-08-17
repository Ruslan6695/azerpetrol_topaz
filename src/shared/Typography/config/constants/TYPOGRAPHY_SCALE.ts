import { FONTS } from '../../../common/config/constants/FONTS'
import { TTypographyColorTypes } from '../types/TTypographyColorTypes'

type TScaleEntry = {
    ff: string
    fz: number
    letterSpacing?: number
    uppercase?: boolean
    color?: TTypographyColorTypes
}

// Шрифтовая лестница макета «21 Век» (design/DESIGN_SPEC.md, раздел
// «Типографика»). Старая лестница (display*, headline*, body*, bodyAccent*,
// caption, captionAccent) удалена вместе с последними её потребителями —
// проп type у Typography теперь обязателен, молчаливого дефолта нет.
export const TYPOGRAPHY_SCALE = {
    // 800 — заголовки, числа, подписи основных кнопок
    h1: { ff: FONTS.EXTRABOLD, fz: 40 },
    h2: { ff: FONTS.EXTRABOLD, fz: 32 },
    h3: { ff: FONTS.EXTRABOLD, fz: 30 },
    h4: { ff: FONTS.EXTRABOLD, fz: 26 },
    h5: { ff: FONTS.EXTRABOLD, fz: 24 },
    h6: { ff: FONTS.EXTRABOLD, fz: 22 },
    num28: { ff: FONTS.EXTRABOLD, fz: 28 },
    num20: { ff: FONTS.EXTRABOLD, fz: 20 },
    num18: { ff: FONTS.EXTRABOLD, fz: 18 },
    num17: { ff: FONTS.EXTRABOLD, fz: 17 },
    num16: { ff: FONTS.EXTRABOLD, fz: 16 },
    num15: { ff: FONTS.EXTRABOLD, fz: 15 },
    num12: { ff: FONTS.EXTRABOLD, fz: 12 },

    // 700 — заголовки строк списка, вторичные кнопки
    label16: { ff: FONTS.BOLD, fz: 16 },
    rowTitle: { ff: FONTS.BOLD, fz: 15 },
    label14: { ff: FONTS.BOLD, fz: 14 },
    label13: { ff: FONTS.BOLD, fz: 13 },

    // 600 — тело, подписи
    body14: { ff: FONTS.SEMIBOLD, fz: 14 },
    body13: { ff: FONTS.SEMIBOLD, fz: 13 },
    body125: { ff: FONTS.SEMIBOLD, fz: 12.5 },
    caption12: { ff: FONTS.SEMIBOLD, fz: 12 },
    caption11: { ff: FONTS.SEMIBOLD, fz: 11 },
    caption10: { ff: FONTS.SEMIBOLD, fz: 10 },
    tabLabel: { ff: FONTS.SEMIBOLD, fz: 10 },
    eyebrow: {
        ff: FONTS.SEMIBOLD,
        fz: 12,
        letterSpacing: 0.4,
        uppercase: true,
        color: 'secondary',
    },
} satisfies Record<string, TScaleEntry>
