import { memo } from 'react'
import QRCode from 'react-native-qrcode-svg'
import { QrCodeModal } from './QrCodeModal'
import { useModal } from '../../common/config/lib/hooks/useModal'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { PressableScale } from '../../PressableScale'
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
    const isPressable = !qrIsLoading && !!value && !hideModal
    return (
        <>
            <PressableScale
                onPress={isPressable ? handleOpenModal : undefined}
                disabled={!isPressable}
                scaleTo={PRESS_SCALE.CARD}
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
            </PressableScale>
        </>
    )
})
