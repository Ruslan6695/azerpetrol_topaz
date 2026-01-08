import React, { useMemo } from 'react'
import WalletSvg from '../assets/balance_active.svg'
import WalletDarkSvg from '../assets/balance_dark.svg'
import WalletGraySvg from '../assets/balance_gray.svg'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { EColorThemes } from '../../common/config/enums/EColorThemes'
type Props = {
    size?: number
    gray?: boolean
}

export const WalletIcon = ({ size, gray }: Props) => {
    const colorTheme = ThemeStore.useTheme()

    const render = useMemo(() => {
        if (colorTheme === EColorThemes.DARK) {
            return (
                <WalletDarkSvg
                    width={(size || 24) * SIZES.PX}
                    height={(size || 24) * SIZES.PX}
                />
            )
        } else {
            if (gray) {
                return (
                    <WalletGraySvg
                        width={(size || 24) * SIZES.PX}
                        height={(size || 24) * SIZES.PX}
                    />
                )
            }
            return (
                <WalletSvg
                    width={(size || 24) * SIZES.PX}
                    height={(size || 24) * SIZES.PX}
                />
            )
        }
    }, [colorTheme, gray])
    return <>{render}</>
}
