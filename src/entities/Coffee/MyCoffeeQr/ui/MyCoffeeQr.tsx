import { memo } from 'react'
import { QrCode } from '../../../../shared/QrCode'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { SIZES } from '../../../../shared'

type Props = {
    qr:string | undefined
}

export const MyCoffeeQr = memo(({qr}: Props) => {
    return (
        <View style={styles.container}>
            
            <QrCode size={172} value={qr} />
            <View style={styles.text}>
                <CustomText fw="600">ДЛЯ НАЛИВА КОФЕ</CustomText>
                <CustomText>
                    Поверните экран телефона QR-кодом к сканеру возле
                    кофемашины.
                </CustomText>
                <CustomText>
                    <CustomText fw="600">После сканирования </CustomText>
                    нажмите на экране кофемашины для начала налива
                </CustomText>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: SIZES.PX * 15,
        marginBottom: SIZES.PX * 20,
    },
    text: {
        flex: 1,
        justifyContent: 'space-between',
    },
})
