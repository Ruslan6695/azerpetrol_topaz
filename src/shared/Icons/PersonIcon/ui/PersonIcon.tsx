import { memo } from 'react'
import { SIZES } from '../../../common/config/constants/sizes'
import PersonSvg from '../assets/person.svg'
import PersonInvertSvg from '../assets/person_invert.svg'
import { ThemeStore } from '../../../common/model/themeStore'
import { EColorThemes } from '../../../common/config/enums/EColorThemes'
type Props = {
    size?: number
    width?: number
}

export const PersonIcon = memo(({ size, width }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    if (colorTheme === EColorThemes.DARK) {
        return (
            <PersonInvertSvg
                width={(size || 25) * SIZES.PX}
                height={(size || 25) * SIZES.PX}
            />
        )
    }
    return (
        <PersonSvg
            width={(size || 25) * SIZES.PX}
            height={(size || 25) * SIZES.PX}
        />
    )
})
