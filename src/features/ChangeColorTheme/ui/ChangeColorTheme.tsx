import { memo, useCallback } from 'react'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import MoonSvg from '../assets/light.svg'
import SunSvg from '../assets/dark.svg'
import {
    changeColorThemeAsyncStore,
    EColorThemes,
    SIZES,
    ThemeStore,
} from '../../../shared'
type Props = {}
const SIZE = 35
export const ChangeColorTheme = memo((props: Props) => {
    const changeColorTheme = ThemeStore.useChangeColorTheme()

    const colorTheme = ThemeStore.useTheme()
    const handlePress = useCallback(() => {
        if (colorTheme == EColorThemes.DARK) {
            changeColorTheme(EColorThemes.LIGHT)
            changeColorThemeAsyncStore(EColorThemes.LIGHT)
        } else {
            changeColorTheme(EColorThemes.DARK)
            changeColorThemeAsyncStore(EColorThemes.DARK)
        }
    }, [colorTheme])
    return (
        <CustomTouchableOpacity onPress={handlePress}>
            {colorTheme === EColorThemes.DARK ? (
                <SunSvg width={SIZES.PX * SIZE} height={SIZES.PX * SIZE} />
            ) : (
                <MoonSvg
                    width={SIZES.PX * (SIZE + 5)}
                    height={SIZES.PX * (SIZE + 5)}
                />
            )}
        </CustomTouchableOpacity>
    )
})
