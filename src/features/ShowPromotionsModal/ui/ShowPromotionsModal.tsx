import { memo, useEffect } from 'react'
import { RADII, SIZES, useModal } from '../../../shared'
import { CustomModal } from '../../../shared/CustomModal'
import { ImageCarousel } from '../../../shared/ImageCarousel'
import { ShowPromotionsModalStore } from '../model/PromotionsModalStore'

type Props = {}

const MODAL_WIDTH = SIZES.WIDTH(0.9)

export const ShowPromotionsModal = memo((props: Props) => {
    const toggleIsOpened = ShowPromotionsModalStore.useToggleIsOpened()
    const isOpened = ShowPromotionsModalStore.useIsOpened()
    const promotions = ShowPromotionsModalStore.usePromotions()
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

    useEffect(() => {
        if (promotions.length > 0 && !isOpened) {
            handleOpenModal()
            toggleIsOpened()
        }
    }, [promotions, isOpened])

    return (
        <CustomModal
            isModalOpened={isShowModal}
            handleClose={handleCloseModal}
            animationType="fade"
            bgDark
            closeOutside
            title="Акции"
            radius={RADII.SHEET}
            width={MODAL_WIDTH}
        >
            {/* Ширина слайда — за вычетом паддинга 20 модалки с двух сторон */}
            <ImageCarousel
                promotions={promotions}
                width={MODAL_WIDTH - 40 * SIZES.PX}
            />
        </CustomModal>
    )
})
