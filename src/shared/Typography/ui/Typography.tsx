import { memo, useMemo } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { ThemeStore } from '../../common/model/themeStore'
import { TYPOGRAPHY_SCALE } from '../config/constants/TYPOGRAPHY_SCALE'
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
        color,
        children,
        marginsPaddings,
        textAlign,
        style,
        customColor,
        numberOfLines,
        ellipsizeMode,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const styles = useMemo(() => {
            const entry = TYPOGRAPHY_SCALE[type] ?? TYPOGRAPHY_SCALE.bodySmall
            const ff = entry.ff
            const fz = entry.fz

            // Часть типов лестницы несёт собственный цвет по умолчанию (eyebrow),
            // но явный проп color всегда важнее.
            const scaleColor =
                'color' in entry
                    ? (entry.color as TTypographyColorTypes)
                    : undefined
            const resolvedColor = color ?? scaleColor ?? 'primary'

            let cl: string
            if (customColor) {
                cl = customColor
            } else {
                switch (resolvedColor) {
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

            const letterSpacing =
                'letterSpacing' in entry && entry.letterSpacing
                    ? entry.letterSpacing * SIZES.PX
                    : undefined
            const textTransform =
                'uppercase' in entry && entry.uppercase
                    ? ('uppercase' as const)
                    : undefined

            return StyleSheet.create({
                text: {
                    fontFamily: ff,
                    color: cl,
                    fontSize: fz * SIZES.PX,
                    letterSpacing,
                    textTransform,
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
        }, [type, color, textAlign, marginsPaddings, COLORS, customColor, style])
        return (
            <Text
                style={styles.text}
                numberOfLines={numberOfLines}
                ellipsizeMode={ellipsizeMode}
            >
                {children}
            </Text>
        )
    }
)
