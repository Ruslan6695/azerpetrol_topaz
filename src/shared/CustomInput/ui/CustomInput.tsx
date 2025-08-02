import React, { ReactNode, forwardRef, useState } from 'react'
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { SIZES } from '../../common/config/constants/sizes'
import { COLORS } from '../../common/config/constants/COLORS'
import { MPLayout } from '../../MpLayout'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'

interface IProps extends TextInputProps {
    onChangeText:
        | {
              (e: React.ChangeEvent<any>): void
              <T = string | React.ChangeEvent<any>>(
                  field: T
              ): T extends React.ChangeEvent<any>
                  ? void
                  : (e: string | React.ChangeEvent<any>) => void
          }
        | any
    maxLength?: number
    onSubmitEnding?: () => void
    ref?: any
    icon?: ReactNode
    styled?: {
        marginsPaddings?: IMarginsPaddings
        width?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
        height?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
    }
    type?: any
    mask?: string
}
export const CustomInput = forwardRef((props: IProps, ref: any) => {
    const width = props.styled
        ? props.styled.width
            ? (props.styled.width.type === 'px' || !props.styled.width) &&
              typeof props.styled.width.value === 'number'
                ? props.styled.width.value * SIZES.PX
                : props.styled.width.value
            : SIZES.WIDTH(0.85)
        : SIZES.WIDTH(0.85)

    const height = props.styled
        ? props.styled.height
            ? (props.styled.height.type === 'px' || !props.styled.height) &&
              typeof props.styled.height.value === 'number'
                ? props.styled.height.value * SIZES.PX
                : props.styled.height.value
            : 56 * SIZES.PX
        : 56 * SIZES.PX

    const styles = StyleSheet.create({
        container: {
            backgroundColor: COLORS.GRAY_2,
            //@ts-ignore
            width,
            //@ts-ignore
            height,
            borderRadius: SIZES.PX * 10,
            fontSize: SIZES.PX * 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: props.styled?.marginsPaddings?.mt
                ? props.styled?.marginsPaddings?.mt * SIZES.PX
                : 0,
            marginBottom: props.styled?.marginsPaddings?.mb
                ? props.styled?.marginsPaddings?.mb * SIZES.PX
                : 0,
            marginRight: props.styled?.marginsPaddings?.mr
                ? props.styled?.marginsPaddings?.mr * SIZES.PX
                : 0,
            marginLeft: props.styled?.marginsPaddings?.ml
                ? props.styled?.marginsPaddings?.ml * SIZES.PX
                : 0,
        },
        input: {
            width: '100%',
            height: '100%',
            paddingHorizontal: props.icon ? SIZES.PX * 10 : SIZES.PX * 21,
            fontSize: SIZES.PX * 16,
            color: COLORS.TEXT,
        },
        iconContainer: {
            width: 25 * SIZES.PX,
            height: 25 * SIZES.PX,
            marginLeft: 10 * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
    return (
        <View style={styles.container}>
            {props.icon && (
                <View style={styles.iconContainer}>{props.icon}</View>
            )}
            <TextInputMask
                placeholderTextColor={COLORS.TEXT_2}
                type={props.type ? props.type : 'custom'}
                options={{
                    mask: props.mask
                        ? props.mask
                        : '******************************************************************************',
                }}
                ref={ref}
                style={styles.input}
                {...props}
                onChangeText={(text, rawtext) => {
                    if (props.keyboardType === 'numeric') {
                        if (text[text.length - 1] === ',') {
                            const newText = text.replace(',', '.')
                            props.onChangeText(newText.replace(/ /g, ''))
                        } else {
                            props.onChangeText(text.replace(/ /g, ''))
                        }
                    } else {
                        props.onChangeText(text.replace(/ /g, ''))
                    }
                }}
            />
        </View>
    )
})
