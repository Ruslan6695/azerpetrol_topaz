import { ReactNode, memo, useCallback, useEffect, useState } from 'react'
import { DimensionValue, Modal, StyleSheet, View } from 'react-native'
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { CloseIcon } from '../../CloseIcon'
import { MOTION } from '../../common/config/constants/MOTION'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { EASING } from '../../common/config/lib/motion/easing'
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
    /**
     * Держать поверхность белой в обеих темах. Нужно там, где содержимое
     * само по себе светлое и от темы не зависит — например QR-код, которому
     * нужна светлая зона тишины по краям.
     */
    lightSurface?: boolean
}

// Оболочка модалки макета (dc.html:658): затемнение + непрозрачная
// карточка r28 (RADII.HERO_SM). Обёртки нажатия здесь без масштаба
// (scaleTo={1}) — они нужны только чтобы поймать тап мимо карточки
// и спрятать клавиатуру.
//
// Анимация появления своя, а не нативная у <Modal>: макетного разделения на
// фейд затемнения и въезд карточки нативный animationType не даёт, а держать
// обе анимации сразу — значит проигрывать их друг по другу. Поэтому у Modal
// стоит animationType="none", а проп animationType этого компонента выбирает
// вариант нашей анимации.
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
        lightSurface,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        // Размонтаж отложен: exiting внутри <Modal> не успевает проиграться,
        // RN сносит нативное окно сразу. Поэтому сначала доигрываем уход,
        // и только потом снимаем Modal.
        const [isMounted, setIsMounted] = useState(isModalOpened)
        const progress = useSharedValue(0)

        useEffect(() => {
            if (isModalOpened) {
                setIsMounted(true)
                return
            }
            progress.value = withTiming(
                0,
                { duration: MOTION.MODAL_OUT, easing: EASING.SCREEN },
                (finished) => {
                    if (finished) {
                        runOnJS(setIsMounted)(false)
                    }
                }
            )
        }, [isModalOpened, progress])

        // onShow, а не useEffect: к этому моменту нативное окно уже на экране,
        // и первые кадры анимации не срезаются.
        const handleShown = useCallback(() => {
            progress.value = withTiming(1, {
                duration: MOTION.MODAL_IN,
                easing: EASING.SCREEN,
            })
        }, [progress])

        const backdropStyle = useAnimatedStyle(() => ({
            opacity: progress.value,
        }))

        const shift = 24 * SIZES.PX
        const cardStyle = useAnimatedStyle(() => {
            if (animationType === 'none') {
                return {}
            }
            // fade — карточка проявляется с лёгким приближением,
            // slide (дефолт) — приподнимается снизу.
            return {
                opacity: progress.value,
                transform:
                    animationType === 'fade'
                        ? [
                              {
                                  scale: interpolate(
                                      progress.value,
                                      [0, 1],
                                      [0.96, 1]
                                  ),
                              },
                          ]
                        : [
                              {
                                  translateY: interpolate(
                                      progress.value,
                                      [0, 1],
                                      [shift, 0]
                                  ),
                              },
                          ],
            }
        })

        const styles = StyleSheet.create({
            wrapper: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            backdrop: {
                ...StyleSheet.absoluteFillObject,
                backgroundColor: bgDark ? COLORS.EFFECTS.Backdrop : undefined,
            },
            // Слой существует только ради анимации входа и обязан быть
            // нейтральным для раскладки. Без width: '100%' он сжимается по
            // контенту (родитель центрирует), и тогда width="100%" карточки
            // считается от этой сжатой обёртки — ширина модалки начинает
            // прыгать вслед за длиной текста. alignItems центрирует карточки
            // с числовой шириной, как это делала внешняя обёртка.
            card: {
                width: '100%',
                alignItems: 'center',
            },
            container: {
                // Модалка лежит над затемнённым бэкдропом, поэтому поверхность
                // обязана быть непрозрачной.
                backgroundColor: lightSurface
                    ? COLORS.GLASS.SurfaceLight
                    : COLORS.GLASS.Surface,
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
                animationType="none"
                transparent={true}
                visible={isMounted}
                onShow={handleShown}
            >
                <PressableScale
                    onPress={closeOutside ? handleClose : undefined}
                    scaleTo={1}
                    style={styles.wrapper}
                >
                    <Animated.View
                        style={[styles.backdrop, backdropStyle]}
                        pointerEvents="none"
                    />
                    <Animated.View style={[styles.card, cardStyle]}>
                        <PressableScale scaleTo={1} style={styles.container}>
                            {!hideHeader && (
                                <View style={styles.topRow}>
                                    {title && (
                                        <Typography type="num18">
                                            {title}
                                        </Typography>
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
                    </Animated.View>
                </PressableScale>
            </Modal>
        )
    }
)
