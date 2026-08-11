import { memo } from 'react'
import { CustomModal } from '../../CustomModal'
import { StyleSheet, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { SIZES } from '../../common/config/constants/sizes'

type Props = {
    handleClose: () => void
    isOpened: boolean
    value: string
}

export const QrCodeModal = memo(({ handleClose, isOpened, value }: Props) => {
    return (
        <CustomModal
            white={true}
            closeOutside
            bgDark
            handleClose={handleClose}
            isModalOpened={isOpened}
        >
            <View style={styles.container}>
                <QRCode size={SIZES.PX * 280} value={value} />
            </View>
        </CustomModal>
    )
})

const styles = StyleSheet.create({
    container: {
        padding: SIZES.PX * 30,
    },
})
