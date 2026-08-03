import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SPACING } from '../../common/config/constants/SPACING'
import { SIZES } from '../../common/config/constants/sizes'

// Нижний отступ контента, чтобы последний блок экрана не уезжал под
// плавающий таб-бар.
//
// Считается, а не берётся константой, потому что бар стоит на
// insets.bottom — а тот меняется от устройства: ~34 на iPhone с домашним
// индикатором и 0 на Android с аппаратными кнопками. Фиксированное
// значение подходило только под одно из них: под iPhone запаса не хватало
// и контент заезжал под меню.
export function useBottomMenuClearance() {
    const insets = useSafeAreaInsets()

    return (
        insets.bottom +
        (SPACING.TABBAR_BOTTOM + SPACING.TABBAR_HEIGHT + SPACING.XL) * SIZES.PX
    )
}
