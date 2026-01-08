import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../shared'
import { QrCode } from '../../../shared/QrCode'

type Props = {
    qr?: string
    qrSize?: number
    height?: number
    qrIsLoading?: boolean
}

export const QrBlock = memo(({ qr, height, qrIsLoading, qrSize }: Props) => {
    return (
        <View style={styles.qrContainer}>
            <QrCode qrIsLoading={qrIsLoading} size={qrSize || 200} value={qr} />
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrContainer: {
        padding: 30 * SIZES.PX,
        backgroundColor: COLORS.BACKGROUND.Tertiary,
        borderRadius: SIZES.PX * 27,
    },
})
