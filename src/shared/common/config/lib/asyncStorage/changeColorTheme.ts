import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'
import { EColorThemes } from '../../enums/EColorThemes'
import { setItemToAsyncStorage } from './setItemToAsyncStorage'

export async function changeColorThemeAsyncStore(theme: EColorThemes) {
    return await setItemToAsyncStorage({
        key: EAsyncStoreKeys.COLOR_THEME,
        value: theme,
    })
}
