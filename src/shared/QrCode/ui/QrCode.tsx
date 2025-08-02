import { memo } from 'react'
import QRCode from 'react-native-qrcode-svg'
import { QrCodeModal } from './QrCodeModal'
import { useModal } from '../../common/config/lib/hooks/useModal'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { SIZES } from '../../common/config/constants/sizes'
import { QrCodeSkeleton } from './QrCodeSkeleton'

type Props = {
    size?: number
    value?: string
    hideModal?: boolean
    qrIsLoading?: boolean
}

export const QrCode = memo(({ value, size, hideModal, qrIsLoading }: Props) => {
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()
    return (
        <>
            <CustomTouchableOpacity
                onPress={
                    qrIsLoading || !value || hideModal
                        ? undefined
                        : handleOpenModal
                }
                activeOpacity={0.8}
            >
                {!qrIsLoading && value ? (
                    <>
                        <QRCode
                            size={size ? size * SIZES.PX : SIZES.PX * 220}
                            value={value}
                        />
                        <QrCodeModal
                            value={value}
                            handleClose={handleCloseModal}
                            isOpened={isShowModal}
                        />
                    </>
                ) : (
                    <QrCodeSkeleton
                        size={size ? size * SIZES.PX : SIZES.PX * 220}
                    />
                )}
            </CustomTouchableOpacity>
        </>
    )
})
