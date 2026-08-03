import { ReactNode, memo } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { CloseIcon } from '../../CloseIcon'
import { SIZES } from '../../common/config/constants/sizes'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { Typography } from '../../Typography'
import { ThemeStore } from '../../common/model/themeStore'

type Props = {
    handleClose: () => void
    isModalOpened: boolean
    closeOutside?: boolean
    width?: number | string
    height?: number | string
    white?: boolean
    children: ReactNode
    animationType?: 'fade' | 'slide' | 'none'
    bgDark?: boolean
    title?: string
    /** В единицах макета, домножается на SIZES.PX внутри */
    radius?: number
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
        white,
        radius = 15,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            wrapper: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgDark ? 'rgba(0, 0, 0, 0.49)' : undefined,
            },
            container: {
                // Модалка лежит над затемнённым бэкдропом, поэтому поверхность
                // обязана быть непрозрачной. Проп white оставлен для совместимости
                // сигнатуры, но белым в тёмной теме больше не мигает.
                backgroundColor: COLORS.GLASS.Surface,
                borderRadius: SIZES.PX * radius,
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
                            <Typography
                                type="bodyAccentSmall"
                                marginsPaddings={{ mr: 30 }}
                            >
                                {title}
                            </Typography>
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
