import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { QrCode } from '../../../../shared/QrCode'
import { Typography } from '../../../../shared/Typography'

type Props = {
    qr: string | undefined
}

export const MyCoffeeQr = memo(({ qr }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.center}>
                <QrCode size={150} value={qr} />
            </View>
            <Typography marginsPaddings={{ mt: 32 }}>
                Для налива кофе поверните экран телефона QR-кодом к сканеру
                возле кофейной машины. После нажмите кнопку на экране кофемашины
                для налива напитка
            </Typography>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        gap: SIZES.PX * 15,
        marginBottom: SIZES.PX * 20,
    },
    center: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLORS.BACKGROUND.Tertiary,
        width: 186 * SIZES.PX,
        height: 186 * SIZES.PX,
        justifyContent: 'center',
        borderRadius: SIZES.PX * 19,
    },
    text: {
        flex: 1,
        justifyContent: 'space-between',
    },
})
