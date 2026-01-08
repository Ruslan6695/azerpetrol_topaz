import { COLORS } from '../../../common/config/constants/COLORS'

export const CUSTOM_BUTTON_COLORS = {
    PRIMARY: {
        DEFAULT: COLORS.BRAND.Primary,
        PRESSED: COLORS.BRAND.Secondary,
        DISABLED: COLORS.BACKGROUND.Secondary,
    },
    SECONDARY: {
        DEFAULT: COLORS.BACKGROUND.Tertiary,
        PRESSED: COLORS.BACKGROUND.Tertiary,
        DISABLED: COLORS.BACKGROUND.Secondary,
    },
    TERTIARY: {
        DEFAULT: COLORS.BACKGROUND.Invert,
        PRESSED: COLORS.BACKGROUND.Invert,
        DISABLED: COLORS.BACKGROUND.Secondary,
    },
}
