import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../shared/CustomText'
import { QrCode, QrCodeSkeleton } from '../../../shared/QrCode'

type Props = {
    qr?: string
    qrSize?: number
    height?: number
    title: string
    qrIsLoading?: boolean
}

export const QrBlock = memo(
    ({ qr, title, height, qrIsLoading, qrSize }: Props) => {
        return (
            <View style={styles.container}>
                <CustomText marginsPaddings={{ mb: 20 }} fz={20} fw="600">
                    {title}
                </CustomText>

                <QrCode qrIsLoading={qrIsLoading} size={180} value={qr} />
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
