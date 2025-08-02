import { ReactNode, memo } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'
import { CustomText } from '../../CustomText'
import { CloseIcon } from '../../CloseIcon'

type Props = {
    handleClose: () => void
    isModalOpened: boolean
    closeOutside?: boolean
    width?: number | string
    height?: number | string
    children: ReactNode
    animationType?: 'fade' | 'slide' | 'none'
    bgDark?: boolean
    title?: string
}

export const CustomModal = memo(
    ({
        handleClose,
        isModalOpened,
        closeOutside,
        width,
        height,
        children,
        animationType,
        bgDark,
        title,
    }: Props) => {
        const styles = StyleSheet.create({
            wrapper: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgDark ? 'rgba(0, 0, 0, 0.49)' : undefined,
            },
            container: {
                backgroundColor: COLORS.WHITE,
                borderRadius: SIZES.PX * 15,
                width: width,
                height: height,
                zIndex: 2,
                padding: SIZES.PX * 20,
            },
            topRow: {
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
        })
        return (
            <Modal
                statusBarTranslucent={true}
                onRequestClose={handleClose}
                animationType={animationType ? animationType : 'slide'}
                transparent={true}
                visible={isModalOpened}
            >
                <CustomTouchableOpacity
                    onPress={closeOutside ? handleClose : undefined}
                    activeOpacity={1}
                    style={styles.wrapper}
                >
                    <CustomTouchableOpacity
                        activeOpacity={1}
                        style={styles.container}
                    >
                        <View style={styles.topRow}>
                            <CustomText marginsPaddings={{ mr: 30 }} fw="800">
                                {title}
                            </CustomText>
                            <CustomTouchableOpacity
                                onPress={handleClose}
                                activeOpacity={0.6}
                            >
                                <CloseIcon />
                            </CustomTouchableOpacity>
                        </View>

                        {children}
                    </CustomTouchableOpacity>
                </CustomTouchableOpacity>
            </Modal>
        )
    }
)
