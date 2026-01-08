import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'
import { MPLayout } from '../../MpLayout'
import { Typography } from '../../Typography'
import ErrorSvg from '../assets/error.svg'
import SuccesSvg from '../assets/success.svg'
import { TOAST_COLORS } from '../config/constants/TOAST_COLORS'

const ERROR_SVG_SIZE = SIZES.PX * 20
const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: ({ text1, props }: { text1: string; props: any }) => (
        <View
            style={[
                styles.toastWrapper,
                { backgroundColor: COLORS.SUCCESS.Primary },
            ]}
        >
            <MPLayout pr={16} style={styles.row} pl={0}>
                <MPLayout mr={9}>
                    <SuccesSvg width={ERROR_SVG_SIZE} height={ERROR_SVG_SIZE} />
                </MPLayout>
                <Typography color="invert">{text1}</Typography>
            </MPLayout>
        </View>
    ),
    error: ({ text1, props }: { text1: string; props: any }) => (
        <View
            style={[
                styles.toastWrapper,
                { backgroundColor: COLORS.ERROR.Primary },
            ]}
        >
            <MPLayout style={styles.row} pr={0} pl={0}>
                <MPLayout mr={9}>
                    <ErrorSvg width={ERROR_SVG_SIZE} height={ERROR_SVG_SIZE} />
                </MPLayout>
                <Typography type="bodyAccentSmall" color="invert">
                    {text1}
                </Typography>
            </MPLayout>
        </View>
    ),
    warning: ({ text1, props }: { text1: string; props: any }) => (
        <View
            style={[
                styles.toastWrapper,
                { backgroundColor: TOAST_COLORS.WARNING },
            ]}
        >
            <MPLayout style={styles.row} pr={16} pl={0}>
                <MPLayout mr={9}>
                    <ErrorSvg width={ERROR_SVG_SIZE} height={ERROR_SVG_SIZE} />
                </MPLayout>
                <Typography type="bodyAccentSmall" color="invert">
                    {text1}
                </Typography>
            </MPLayout>
        </View>
    ),
}

type Props = {}

export const ToastComponent = (props: Props) => {
    return (
        //@ts-ignore
        <Toast config={toastConfig} />
    )
}

const styles = StyleSheet.create({
    toastWrapper: {
        justifyContent: 'center',
        width: '90%',
        position: 'absolute',
        top: 0,
        padding: SIZES.PX * 10,
        paddingHorizontal: SIZES.PX * 20,
        borderRadius: SIZES.PX * 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
