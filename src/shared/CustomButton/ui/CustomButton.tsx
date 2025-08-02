import { ReactNode, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { COLORS } from '../../common/config/constants/COLORS'
import { CustomText } from '../../CustomText'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { MPLayout } from '../../MpLayout'

type Props = {
    onPress: () => void
    children: string

    disabled?: boolean
    icon?: ReactNode

    styled?: {
        marginsPaddings?: IMarginsPaddings
        type?: 'DARK' | 'SUCCES' | 'OUTLINED' | 'TEXT' | 'ERROR' | 'WHITE'
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
        textColor?: string
        width?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
        height?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
        bg?: string
        activeOpacity?: number
    }
}

export const CustomButton = memo(
    ({ children, onPress, disabled, styled, icon }: Props) => {
        const widthh = styled
            ? styled.width
                ? (styled.width.type === 'px' || !styled.width) &&
                  typeof styled.width.value === 'number'
                    ? styled.width.value * SIZES.PX
                    : styled.width.value
                : SIZES.WIDTH(0.85)
            : SIZES.WIDTH(0.85)

        const heighth = styled
            ? styled.height
                ? (styled.height.type === 'px' || !styled.height) &&
                  typeof styled.height.value === 'number'
                    ? styled.height.value * SIZES.PX
                    : styled.height.value
                : 56 * SIZES.PX
            : 56 * SIZES.PX

        const styles = StyleSheet.create({
            container: {
                marginTop: styled?.marginsPaddings?.mt
                    ? styled?.marginsPaddings?.mt * SIZES.PX
                    : 0,
                marginBottom: styled?.marginsPaddings?.mb
                    ? styled?.marginsPaddings?.mb * SIZES.PX
                    : 0,
                marginRight: styled?.marginsPaddings?.mr
                    ? styled?.marginsPaddings?.mr * SIZES.PX
                    : 0,
                marginLeft: styled?.marginsPaddings?.ml
                    ? styled?.marginsPaddings?.ml * SIZES.PX
                    : 0,
                paddingTop: styled?.marginsPaddings?.pt
                    ? styled?.marginsPaddings?.pt * SIZES.PX
                    : 0,
                paddingBottom: styled?.marginsPaddings?.pb
                    ? styled?.marginsPaddings?.pb * SIZES.PX
                    : 0,
                paddingRight: styled?.marginsPaddings?.pr
                    ? styled?.marginsPaddings?.pr * SIZES.PX
                    : 0,
                paddingLeft: styled?.marginsPaddings?.pl
                    ? styled?.marginsPaddings?.pl * SIZES.PX
                    : 0,
                flexDirection: 'row',
                backgroundColor: styled?.bg
                    ? styled.bg
                    : styled?.type === 'DARK'
                    ? COLORS.GRAY
                    : styled?.type === 'OUTLINED'
                    ? undefined
                    : styled?.type === 'TEXT'
                    ? undefined
                    : styled?.type === 'ERROR'
                    ? COLORS.RED
                    : styled?.type === 'WHITE'
                    ? COLORS.WHITE
                    : COLORS.GREEN,
                //@ts-ignore
                width: widthh,
                //@ts-ignore
                height: heighth,
                alignItems: 'center',

                justifyContent: icon ? 'flex-start' : 'center',
                borderRadius: SIZES.PX * 12,

                position: 'relative',
                borderColor:
                    styled?.type === 'OUTLINED'
                        ? disabled
                            ? COLORS.GRAY_1
                            : COLORS.GRAY
                        : undefined,
                borderWidth: styled?.type === 'OUTLINED' ? 1 : undefined,
            },
        })
        return (
            <CustomTouchableOpacity
                activeOpacity={styled?.activeOpacity || 0.6}
                disabled={disabled}
                onPress={onPress}
                style={styles.container}
            >
                {icon && (
                    <MPLayout ml={10} mr={10}>
                        {icon}
                    </MPLayout>
                )}

                <CustomText
                    fw={styled?.fw}
                    color={styled?.textColor}
                    secondary={disabled}
                    white={
                        styled?.type !== 'OUTLINED' &&
                        styled?.type !== 'TEXT' &&
                        styled?.type !== 'WHITE'
                    }
                    fz={styled?.fz || 18}
                >
                    {children}
                </CustomText>
            </CustomTouchableOpacity>
        )
    }
)
