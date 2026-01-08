import { memo, useMemo } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { ThemeStore } from '../../common/model/themeStore'
import { TTypographyColorTypes } from '../config/types/TTypographyColorTypes'
import { TTypographyTypes } from '../config/types/TTypographyTypes'

interface Props extends TextProps {
    type?: TTypographyTypes
    color?: TTypographyColorTypes
    children: string | any
    marginsPaddings?: IMarginsPaddings
    textAlign?: 'center' | 'left' | 'right'
    customColor?: string
}

export const Typography = memo(
    ({
        type = 'bodySmall',
        color = 'primary',
        children,
        marginsPaddings,
        textAlign,
        style,
        customColor,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const styles = useMemo(() => {
            let ff: string = 'Manrope-SemiBold'
            let cl: string = COLORS.TEXT.Success
            let fz: number

            switch (type) {
                case 'displayLarge':
                    fz = 36
                    break
                case 'displayMedium':
                    fz = 28
                    break
                case 'displaySmall':
                    fz = 16
                    break
                case 'headlineMedium':
                    fz = 36
                    break
                case 'headlineSmall':
                    fz = 24
                    break
                case 'bodyLarge':
                    ff = 'Manrope-Medium'
                    fz = 24
                    break
                case 'bodyMedium':
                    ff = 'Manrope-Medium'
                    fz = 20
                    break
                case 'bodySmall':
                    ff = 'Manrope-Medium'
                    fz = 16
                    break
                case 'bodyAccentLarge':
                    fz = 24
                    break
                case 'bodyAccentMedium':
                    fz = 20
                    break
                case 'bodyAccentSmall':
                    fz = 16
                    break

                case 'caption':
                    fz = 12
                    break
                case 'captionAccent':
                    ff = 'Manrope-Medium'
                    fz = 12
                    break
                default:
                    fz = 16
                    ff = 'Manrope-SemiBold'
                    break
            }
            if (customColor) {
                cl = customColor
            } else {
                switch (color) {
                    case 'secondary': {
                        cl = COLORS.TEXT.Secondary
                        break
                    }
                    case 'tertiary': {
                        cl = COLORS.TEXT.Tertiary
                        break
                    }
                    case 'invert': {
                        cl = COLORS.TEXT.Invert
                        break
                    }
                    case 'link': {
                        cl = COLORS.TEXT.Link
                        break
                    }
                    case 'error': {
                        cl = COLORS.TEXT.Error
                        break
                    }
                    case 'success': {
                        cl = COLORS.TEXT.Success
                        break
                    }
                    default:
                        cl = COLORS.TEXT.Primary
                        break
                }
            }

            return StyleSheet.create({
                text: {
                    fontFamily: ff,
                    color: cl,
                    fontSize: fz * SIZES.PX,
                    marginTop: marginsPaddings?.mt
                        ? marginsPaddings?.mt * SIZES.PX
                        : 0,
                    marginBottom: marginsPaddings?.mb
                        ? marginsPaddings?.mb * SIZES.PX
                        : 0,
                    marginRight: marginsPaddings?.mr
                        ? marginsPaddings?.mr * SIZES.PX
                        : 0,
                    marginLeft: marginsPaddings?.ml
                        ? marginsPaddings?.ml * SIZES.PX
                        : 0,
                    paddingTop: marginsPaddings?.pt
                        ? marginsPaddings?.pt * SIZES.PX
                        : 0,
                    paddingBottom: marginsPaddings?.pb
                        ? marginsPaddings?.pb * SIZES.PX
                        : 0,
                    paddingRight: marginsPaddings?.pr
                        ? marginsPaddings?.pr * SIZES.PX
                        : 0,
                    paddingLeft: marginsPaddings?.pl
                        ? marginsPaddings?.pl * SIZES.PX
                        : 0,
                    textAlign: textAlign ? textAlign : 'left',
                    ///@ts-ignore
                    ...style,
                },
            })
        }, [type, color, textAlign, marginsPaddings, COLORS, customColor])
        return <Text style={styles.text}>{children}</Text>
    }
)
