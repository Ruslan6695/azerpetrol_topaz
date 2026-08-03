import React from 'react'
import BonusSvg from '../assets/bonus.svg'
import { SIZES } from '../../common/config/constants/sizes'
import Foundation from '@expo/vector-icons/Foundation'
import { COLORS } from '../../common/config/constants/COLORS'
import { MPLayout } from '../../MpLayout'
import Feather from '@expo/vector-icons/Feather'
import { ThemeStore } from '../../common/model/themeStore'
import { EColorThemes } from '../../common/config/enums/EColorThemes'

type Props = {
    size?: number
    bold?: boolean
    color?: string
    ml?: number
    mt?: number
}

export const BonusIcon = ({ size, color, bold, ml, mt }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    if (bold) {
        return (
            <MPLayout mt={mt} ml={ml ?? 5}>
                <Foundation
                    name="bold"
                    size={size || 24 * SIZES.PX}
                    color={
                        color
                            ? color
                            : colorTheme === EColorThemes.DARK
                            ? COLORS.TEXT.Invert
                            : COLORS.TEXT.Primary
                    }
                />
            </MPLayout>
        )
    }
    return (
        <MPLayout mt={mt} ml={ml || 3}>
            <Feather
                name="bold"
                size={size || 16 * SIZES.PX}
                color={
                    color
                        ? color
                        : colorTheme === EColorThemes.DARK
                        ? COLORS.TEXT.Invert
                        : COLORS.TEXT.Primary
                }
            />
        </MPLayout>
    )
}
