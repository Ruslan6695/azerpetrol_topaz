import { ReactNode, memo, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { MPLayout } from '../../MpLayout'
import { Typography } from '../../Typography'
import { SIZES } from '../../common/config/constants/sizes'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { ThemeStore } from '../../common/model/themeStore'
import { TCustomButtonTypes } from '../config/types/TCustomButtonTypes'

type Props = {
    onPress: () => void
    children: string

    disabled?: boolean
    icon?: ReactNode

    styled?: {
        marginsPaddings?: IMarginsPaddings
        borderRadius?: number
        type?: TCustomButtonTypes
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
        const COLORS = ThemeStore.useCOLORS()
        const styles = useMemo(() => {
            const widthh = styled
                ? styled.width
                    ? (styled.width.type === 'px' || !styled.width) &&
                      typeof styled.width.value === 'number'
                        ? styled.width.value * SIZES.PX
                        : styled.width.value
                    : '100%'
                : '100%'

            const heighth = styled
                ? styled.height
                    ? (styled.height.type === 'px' || !styled.height) &&
                      typeof styled.height.value === 'number'
                        ? styled.height.value * SIZES.PX
                        : styled.height.value
                    : 56 * SIZES.PX
                : 56 * SIZES.PX
            return StyleSheet.create({
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
                        : styled?.type === 'secondary'
                        ? COLORS.BACKGROUND.Tertiary
                        : styled?.type === 'tertiary'
                        ? COLORS.BACKGROUND.Invert
                        : COLORS.BRAND.Primary,
                    //@ts-ignore
                    width: widthh,
                    //@ts-ignore
                    height: heighth,
                    alignItems: 'center',

                    justifyContent: icon ? 'flex-start' : 'center',
                    borderRadius: styled?.borderRadius || 1000 * SIZES.PX,
                    position: 'relative',
                },
                icon: {
                    position: 'absolute',
                    left: '5%',
                    top: '50%',
                },
            })
        }, [styled])
        return (
            <CustomTouchableOpacity
                activeOpacity={styled?.activeOpacity || 0.6}
                disabled={disabled}
                onPress={onPress}
                style={styles.container}
            >
                {icon && (
                    <MPLayout ml={10} mr={20}>
                        {icon}
                    </MPLayout>
                )}

                <Typography
                    type="bodyAccentSmall"
                    color={styled?.type === 'secondary' ? 'primary' : 'invert'}
                >
                    {children}
                </Typography>
            </CustomTouchableOpacity>
        )
    }
)
