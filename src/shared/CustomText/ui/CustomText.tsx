import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { COLORS } from '../../common/config/constants/COLORS'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'

interface IProps extends TextProps {
    children: any
    primary?: boolean
    secondary?: boolean
    fz?: number
    fw?:
        | 'normal'
        | 'bold'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900'
    color?: string
    customF?: boolean
    textAlign?: 'center' | 'left' | 'right'
    white?: boolean
    marginsPaddings?: IMarginsPaddings
}

export const CustomText = ({
    children,
    primary,
    secondary,
    fz,
    fw,
    color,
    customF,
    textAlign,
    white,
    marginsPaddings,
    ...props
}: IProps) => {
    const fontSize = fz ? SIZES.PX * fz : SIZES.PX * 15
    const styles = StyleSheet.create({
        text: {
            //@ts-ignore
            ...props.style,
            color: color
                ? color
                : white
                ? COLORS.WHITE
                : secondary
                ? COLORS.TEXT_2
                : COLORS.TEXT,
            fontSize,
            fontWeight: !customF ? fw : fw,
            marginTop: marginsPaddings?.mt ? marginsPaddings?.mt * SIZES.PX : 0,
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
        },
    })
    return <Text style={styles.text}>{children}</Text>
}
