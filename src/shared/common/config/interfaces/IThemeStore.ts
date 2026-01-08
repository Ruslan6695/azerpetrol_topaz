import { COLORS } from '../constants/COLORS'
import { EColorThemes } from '../enums/EColorThemes'

export interface IThemeStore {
    COLORS: typeof COLORS
    getColoreTheme: () => Promise<void>
    theme: EColorThemes
    changeColorTheme:(theme:EColorThemes) => void
}
