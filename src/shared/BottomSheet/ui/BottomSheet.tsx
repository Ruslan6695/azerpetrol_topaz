import { ReactNode, useEffect } from 'react'
import { Dimensions, Modal, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { ThemeStore } from '../../common/model/themeStore'

type Props = {
    children: ReactNode
    handleClose?: () => void
    hideDisabled?: boolean
    bottomPx?: number
    isOpened: boolean
    bgDark?: boolean
    closeOnPressOutside?: boolean
}
const { height: SCREEN_HEIGHT, width } = Dimensions.get('window')
const BottomSheet = ({
    children,
    handleClose,
    hideDisabled,
    isOpened,
    bgDark,
    closeOnPressOutside,
}: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const translateY = useSharedValue(0)
    const context = useSharedValue({ y: 0 })

    /*  const panGesure = Gesture.Pan()
        .onStart((event) => {
            context.value = { y: translateY.value }
        })
        .onChange((event) => {
            translateY.value = withSpring(
                Math.max(event.translationY + context.value.y, -SCREEN_HEIGHT),
                { damping: 50 }
            )
        })
        .onEnd((event) => {
            if (translateY.value > -SCREEN_HEIGHT / 1.5) {
                translateY.value = withSpring(SIZES.PX * 100, { damping: 20 })
                handleClose && runOnJS(handleClose)()
            } else {
            }
        })

    useEffect(() => {
        if (isOpened)
            translateY.value = withSpring(
                bottomPx
                    ? -SCREEN_HEIGHT / 1.5 + bottomPx
                    : -SCREEN_HEIGHT / 1.5,
                { damping: 30 }
            )
    }, [bottomPx, isOpened])

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        }
    }, []) */

    const styles = StyleSheet.create({
        wrapper: {
            width: SIZES.WIDTH(1),
            height: SIZES.HEIGHT(1),
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: bgDark ? COLORS.EFFECTS.Backdrop : undefined,
        },
        container: {
            position: 'absolute',
            width: SIZES.WIDTH(1),

            // Всплывающая панель над бэкдропом — только непрозрачная поверхность.
            backgroundColor: COLORS.GLASS.Surface,
            borderTopLeftRadius: RADII.SHEET * SIZES.PX,
            borderTopRightRadius: RADII.SHEET * SIZES.PX,

            elevation: 10,
        },
    })

    return (
        <>
            {hideDisabled ? (
                <Modal
                    onRequestClose={handleClose}
                    animationType="slide"
                    visible={isOpened}
                    transparent
                >
                    <CustomTouchableOpacity
                        activeOpacity={1}
                        onPress={closeOnPressOutside ? handleClose : undefined}
                        style={styles.wrapper}
                    >
                        <CustomTouchableOpacity
                            activeOpacity={1}
                            style={styles.container}
                        >
                            <View>{children}</View>
                        </CustomTouchableOpacity>
                    </CustomTouchableOpacity>
                </Modal>
            ) : (
                <Modal
                    onRequestClose={handleClose}
                    animationType="slide"
                    visible={isOpened}
                    transparent
                >
                    <CustomTouchableOpacity
                        onPress={closeOnPressOutside ? handleClose : undefined}
                        activeOpacity={1}
                        style={styles.wrapper}
                    >
                        <Animated.View style={[styles.container]}>
                            {children}
                        </Animated.View>
                    </CustomTouchableOpacity>
                </Modal>
            )}
        </>
    )
}

export default BottomSheet
