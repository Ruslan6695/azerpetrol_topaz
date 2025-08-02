import { ReactElement, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../../common/config/constants/COLORS'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { SIZES } from '../../common/config/constants/sizes'
import { CustomText } from '../../CustomText'
import SuccessSvg from '../assets/success.svg'
import ErrorSvg from '../assets/error.svg'
import InfoSvg from '../assets/info.svg'
import WarningSvg from '../assets/warning.svg'
import { MPLayout } from '../../MpLayout'
type Props = {
    type: 'error' | 'warning' | 'info' | 'success'
    text: string
    icon?: ReactElement
    styled?: {
        marginsPaddings?: IMarginsPaddings

        fz?: number
        width?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
        height?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
    }
}

export const ToastBlock = memo(({ styled, type, text, icon }: Props) => {
    const widthh = styled
        ? styled.width
            ? (styled.width.type === 'px' || !styled.width) &&
              typeof styled.width.value === 'number'
                ? styled.width.value * SIZES.PX
                : styled.width.value
            : SIZES.WIDTH(0.85)
        : SIZES.WIDTH(0.85)

    const styles = StyleSheet.create({
        container: {
            backgroundColor:
                type === 'error'
                    ? COLORS.TOAST_ERROR
                    : type === 'info'
                    ? COLORS.TOAST_INFO
                    : type === 'success'
                    ? COLORS.TOAST_SUCCESS
                    : COLORS.TOAST_WARNING,
            //@ts-ignore

            //@ts-ignore
            width: styled?.width ? widthh : 'auto',
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
            borderRadius: 12 * SIZES.PX,
            padding: 15 * SIZES.PX,
            flexDirection: 'row',
            alignItems: 'center',
        },
    })
    return (
        <View style={styles.container}>
            <MPLayout pr={15}>
                {icon ? (
                    icon
                ) : type === 'error' ? (
                    <ErrorSvg height={25} width={25} />
                ) : type === 'info' ? (
                    <InfoSvg height={25} width={25} />
                ) : type === 'warning' ? (
                    <WarningSvg height={25} width={25} />
                ) : (
                    <SuccessSvg height={25} width={25} />
                )}
            </MPLayout>
            <CustomText style={{ width: '90%' }} white>
                {text}
            </CustomText>
        </View>
    )
})
