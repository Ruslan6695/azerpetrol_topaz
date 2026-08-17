import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutChangeEvent, Modal, StyleSheet } from 'react-native'
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { MOTION } from '../../common/config/constants/MOTION'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { EASING } from '../../common/config/lib/motion/easing'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'

type Props = {
    children: ReactNode
    handleClose?: () => void
    hideDisabled?: boolean
    isOpened: boolean
    bgDark?: boolean
    closeOnPressOutside?: boolean
}

// Доля высоты шита, после которой отпускание закрывает панель.
const DISMISS_RATIO = 0.25
// Скорость броска вниз, закрывающая шит независимо от пройденного пути.
const DISMISS_VELOCITY = 800

// Всплывающая панель снизу. Анимация своя, а не нативная у <Modal>: нужно
// разделить фейд затемнения и выезд панели, а ещё дать перетаскивание вниз.
// Поэтому у Modal animationType="none", а размонтаж отложен до конца анимации
// ухода — иначе панель исчезала бы мгновенно.
const BottomSheet = ({
    children,
    handleClose,
    hideDisabled,
    isOpened,
    bgDark,
    closeOnPressOutside,
}: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const [isMounted, setIsMounted] = useState(isOpened)
    // Высота панели: от неё считается и точка «закрыто», и порог перетаскивания.
    // До первого onLayout берём высоту экрана — панель заведомо ниже.
    const sheetHeight = useSharedValue(SIZES.HEIGHT(1))
    const translateY = useSharedValue(SIZES.HEIGHT(1))
    const startY = useSharedValue(0)
    const backdropProgress = useSharedValue(0)

    const close = useCallback(() => {
        handleClose?.()
    }, [handleClose])

    useEffect(() => {
        if (isOpened) {
            setIsMounted(true)
            return
        }
        backdropProgress.value = withTiming(0, { duration: MOTION.SHEET_OUT })
        translateY.value = withTiming(
            sheetHeight.value,
            { duration: MOTION.SHEET_OUT, easing: EASING.SCREEN },
            (finished) => {
                if (finished) {
                    runOnJS(setIsMounted)(false)
                }
            }
        )
    }, [isOpened, backdropProgress, translateY, sheetHeight])

    // onShow, а не useEffect: нативное окно уже на экране, первые кадры целы.
    const handleShown = useCallback(() => {
        translateY.value = withTiming(0, {
            duration: MOTION.SHEET_IN,
            easing: EASING.SCREEN,
        })
        backdropProgress.value = withTiming(1, { duration: MOTION.BACKDROP })
    }, [translateY, backdropProgress])

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const { height } = event.nativeEvent.layout
            if (height > 0) {
                sheetHeight.value = height
            }
        },
        [sheetHeight]
    )

    const pan = useMemo(
        () =>
            Gesture.Pan()
                .enabled(!hideDisabled)
                .onStart(() => {
                    startY.value = translateY.value
                })
                .onUpdate((event) => {
                    // Вверх панель не тянется — только вниз, к закрытию.
                    translateY.value = Math.max(
                        0,
                        startY.value + event.translationY
                    )
                })
                .onEnd((event) => {
                    const shouldClose =
                        translateY.value > sheetHeight.value * DISMISS_RATIO ||
                        event.velocityY > DISMISS_VELOCITY
                    if (shouldClose) {
                        backdropProgress.value = withTiming(0, {
                            duration: MOTION.SHEET_OUT,
                        })
                        translateY.value = withTiming(
                            sheetHeight.value,
                            { duration: MOTION.SHEET_OUT },
                            (finished) => {
                                if (finished) {
                                    runOnJS(close)()
                                }
                            }
                        )
                    } else {
                        translateY.value = withSpring(0, {
                            damping: 22,
                            stiffness: 240,
                        })
                    }
                }),
        [hideDisabled, close, startY, translateY, sheetHeight, backdropProgress]
    )

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }))

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropProgress.value,
    }))

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: bgDark ? COLORS.EFFECTS.Backdrop : undefined,
        },
        outside: {
            ...StyleSheet.absoluteFillObject,
        },
        container: {
            width: SIZES.WIDTH(1),
            // Всплывающая панель над бэкдропом — только непрозрачная поверхность.
            backgroundColor: COLORS.GLASS.Surface,
            borderTopLeftRadius: RADII.SHEET * SIZES.PX,
            borderTopRightRadius: RADII.SHEET * SIZES.PX,
            elevation: 10,
        },
    })

    return (
        <Modal
            onRequestClose={close}
            animationType="none"
            visible={isMounted}
            onShow={handleShown}
            statusBarTranslucent
            transparent
        >
            {/* Обязательно свой Root внутри Modal: на Android модалка — это
                отдельное нативное окно, и жесты из внешнего дерева в него
                не долетают. */}
            <GestureHandlerRootView style={styles.root}>
                <Animated.View
                    style={[styles.backdrop, backdropStyle]}
                    pointerEvents="none"
                />
                {/* Перехват тапа мимо панели: своего содержимого у слоя нет,
                    он нужен только ради onPress и скрытия клавиатуры. */}
                <PressableScale
                    scaleTo={1}
                    style={styles.outside}
                    onPress={closeOnPressOutside ? close : undefined}
                >
                    <></>
                </PressableScale>
                <GestureDetector gesture={pan}>
                    <Animated.View
                        style={[styles.container, sheetStyle]}
                        onLayout={handleLayout}
                    >
                        {children}
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </Modal>
    )
}

export default BottomSheet
