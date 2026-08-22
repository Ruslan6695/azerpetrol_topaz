import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IFuelStore } from '../config/interfaces/IFuelStore'
import { IThemeStore } from '../config/interfaces/IThemeStore'
import { COLORS, COLORS_DARK } from '../config/constants/COLORS'
import { getItemFromAsyncStorage } from '../config/lib/asyncStorage/getItemFromAsyncStorage'
import { EAsyncStoreKeys } from '../config/enums/EAsyncStoreKeys'
import { EColorThemes } from '../config/enums/EColorThemes'
import { changeColorThemeAsyncStore } from '../config/lib/asyncStorage/changeColorTheme'

const store = create<IThemeStore>()(
    immer((set) => ({
        COLORS: COLORS_DARK,
        theme: EColorThemes.DARK,
        changeColorTheme(theme) {
            set((state) => {
                if (theme === EColorThemes.LIGHT) {
                    state.COLORS = COLORS
                    state.theme = EColorThemes.LIGHT
                } else {
                    state.COLORS = COLORS_DARK
                    state.theme = EColorThemes.DARK
                }
            })
        },
        async getColoreTheme() {
            const resp = await getItemFromAsyncStorage(
                EAsyncStoreKeys.COLOR_THEME
            )
            switch (resp) {
                // Пользователь ещё не выбирал тему — по умолчанию тёмная,
                // системную настройку не учитываем
                case null:
                    set((state) => {
                        state.COLORS = COLORS_DARK
                        state.theme = EColorThemes.DARK
                    })
                    break
                case EColorThemes.DARK:
                    set((state) => {
                        state.COLORS = COLORS_DARK
                        state.theme = EColorThemes.DARK
                    })
                    break
                case EColorThemes.LIGHT:
                    set((state) => {
                        state.COLORS = COLORS
                        state.theme = EColorThemes.LIGHT
                    })
                    break
            }
        },
    }))
)

export const ThemeStore = createSelectorHooks(store)
