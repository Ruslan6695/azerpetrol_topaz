import React, { useCallback, useEffect } from 'react'
import { CustomModal } from '../../../shared/CustomModal'
import { Image, Modal, ScrollView, StyleSheet, View } from 'react-native'
import {
    AppStore,
    COLORS,
    COLORS_DARK,
    SIZES,
    ThemeStore,
    useModal,
} from '../../../shared'
import { ImageCarousel } from '../../../shared/ImageCarousel/ui/ImageCarousel'
import { Typography } from '../../../shared/Typography'
import { CloseIcon } from '../../../shared/CloseIcon'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { useFocusEffect } from 'expo-router'
import { ShowPromotionsModalStore } from '../model/PromotionsModalStore'

type Props = {}

export const ShowPromotionsModal = (props: Props) => {
    const toggleIsOpened = ShowPromotionsModalStore.useToggleIsOpened()
    const isOpened = ShowPromotionsModalStore.useIsOpened()
    const promotions = ShowPromotionsModalStore.usePromotions()
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()
    const isTokenRefreshed = AppStore.useIsTokenRefreshed()

    /*   const COLORS = ThemeStore.useCOLORS() */
    const styles = StyleSheet.create({
        wrapper: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        container: {
            backgroundColor: COLORS.BACKGROUND.Tertiary,
            padding: 10,
            borderRadius: 20,
            alignItems: 'center',
        },
        image: {
            objectFit: 'contain',
            width: SIZES.WIDTH(0.8),
            height: 150,
        },
        closeIcon: {
            position: 'absolute',
            top: 5 * SIZES.PX,
            right: 5 * SIZES.PX,
            padding: 5 * SIZES.PX,
        },
    })

    useEffect(() => {
        if (promotions.length > 0 && !isOpened ) {
            handleOpenModal()
            toggleIsOpened()
        }
    }, [promotions, isOpened])
    return (
        <Modal
            statusBarTranslucent={true}
            animationType="fade"
            visible={isShowModal}
            transparent
        >
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <Typography
                        color="secondary"
                        marginsPaddings={{ mb: 10 }}
                        type="bodyAccentMedium"
                    >
                        Акции
                    </Typography>
                    <CustomTouchableOpacity
                        onPress={handleCloseModal}
                        style={styles.closeIcon}
                    >
                        <CloseIcon />
                    </CustomTouchableOpacity>
                    <ImageCarousel promotions={promotions} />
                </View>
            </View>
        </Modal>
    )
}
