import { ReactNode, memo } from 'react'
import { DimensionValue, Modal, StyleSheet, View } from 'react-native'
import { CloseIcon } from '../../CloseIcon'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'

type Props = {
    handleClose: () => void
    isModalOpened: boolean
    closeOutside?: boolean
    width?: DimensionValue
    height?: DimensionValue
    children: ReactNode
    animationType?: 'fade' | 'slide' | 'none'
    bgDark?: boolean
    title?: string
    /** В единицах макета, домножается на SIZES.PX внутри */
    radius?: number
    /** Спрятать верхний ряд с крестиком — у диалогов подтверждения его нет */
    hideHeader?: boolean
}

// Оболочка модалки макета (dc.html:658): затемнение + непрозрачная
// карточка r28 (RADII.HERO_SM). Обёртки нажатия здесь без масштаба
// (scaleTo={1}) — они нужны только чтобы поймать тап мимо карточки
// и спрятать клавиатуру.
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
        radius = RADII.HERO_SM,
        hideHeader,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            wrapper: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgDark ? COLORS.EFFECTS.Backdrop : undefined,
            },
            container: {
                // Модалка лежит над затемнённым бэкдропом, поэтому поверхность
                // обязана быть непрозрачной.
                backgroundColor: COLORS.GLASS.Surface,
                borderRadius: SIZES.PX * radius,
                width: width,
                height: height,
                zIndex: 2,
                padding: SPACING.SCREEN * SIZES.PX,
            },
            topRow: {
                flexDirection: 'row',
                justifyContent: title ? 'space-between' : 'flex-end',
                alignItems: 'center',
                gap: SPACING.MD * SIZES.PX,
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
                <PressableScale
                    onPress={closeOutside ? handleClose : undefined}
                    scaleTo={1}
                    style={styles.wrapper}
                >
                    <PressableScale scaleTo={1} style={styles.container}>
                        {!hideHeader && (
                            <View style={styles.topRow}>
                                {title && (
                                    <Typography type="num18">{title}</Typography>
                                )}
                                <PressableScale
                                    onPress={handleClose}
                                    scaleTo={PRESS_SCALE.BACK}
                                    hitSlop={10}
                                >
                                    <CloseIcon />
                                </PressableScale>
                            </View>
                        )}

                        {children}
                    </PressableScale>
                </PressableScale>
            </Modal>
        )
    }
)
