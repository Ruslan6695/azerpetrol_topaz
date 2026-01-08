import { LinearGradient } from 'expo-linear-gradient'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { SIZES, ThemeStore } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'
type Props = {
    onChangeLitersValue: (value: string) => void
    fuelPrice: number
    litersValue: string
}
const SELECTOR_HEIGHT = 280
const MAX_LITERS = 60

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

export const FuelLitersSelector = memo(
    ({ onChangeLitersValue, fuelPrice, litersValue }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const rHeight = useSharedValue(0)
        const [height, setheight] = useState(0)
        const context = useSharedValue({ y: 0 })

        const rStyle = useAnimatedStyle(() => {
            return { height: rHeight.value }
        }, [])

        const handleSetLiters = useCallback((val: number) => {
            onChangeLitersValue(String(val))
        }, [])
        const handleSetHeight = useCallback((val: number) => {
            setheight(
                Math.round((val / (SIZES.PX * SELECTOR_HEIGHT)) * MAX_LITERS)
            )
        }, [])

        const handlePressOnPlus = useCallback(() => {
            if (height < MAX_LITERS) {
                onChangeLitersValue(String(height + 1))
                setheight((prev) => {
                    const px = (SELECTOR_HEIGHT * SIZES.PX) / MAX_LITERS
                    rHeight.value = withSpring(px * (prev + 1))
                    return (prev += 1)
                })
            }
        }, [MAX_LITERS, height])
        const handlePressOnMinus = useCallback(() => {
            if (height != 0) {
                onChangeLitersValue(String(height - 1))
                setheight((prev) => {
                    const px = (SELECTOR_HEIGHT * SIZES.PX) / MAX_LITERS
                    rHeight.value = withSpring(px * (prev - 1))
                    return (prev -= 1)
                })
            }
        }, [height])

        const PanGeture = Gesture.Pan()
            .onStart((event) => {
                context.value = { y: rHeight.value }
            })
            .onChange((e) => {
                const value = -e.translationY + context.value.y
                if (value >= 0 && value < SELECTOR_HEIGHT * SIZES.PX) {
                    rHeight.value = -e.translationY + context.value.y
                    runOnJS(handleSetHeight)(value)
                } else if (value < 0) {
                    runOnJS(handleSetHeight)(0)
                } else if (value > SELECTOR_HEIGHT * SIZES.PX) {
                    runOnJS(handleSetHeight)(SELECTOR_HEIGHT * SIZES.PX)
                }
            })
            .onEnd((e) => {
                const value = -e.translationY + context.value.y

                if (value >= 0 && value < SELECTOR_HEIGHT * SIZES.PX) {
                    runOnJS(handleSetLiters)(height)
                } else if (value < 0) {
                    runOnJS(handleSetLiters)(height)
                } else if (value > SELECTOR_HEIGHT) {
                    runOnJS(handleSetLiters)(height)
                }
            })

        const styles = StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            container: {
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                height: SELECTOR_HEIGHT * SIZES.PX,
                width: 130 * SIZES.PX,
                borderRadius: SIZES.PX * 20,
                position: 'relative',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
            },
            left: {
                flex: 1,
                alignItems: 'flex-end',
                paddingRight: 16 * SIZES.PX,
            },
            right: {
                flex: 1,
                alignItems: 'flex-start',
                paddingLeft: 16 * SIZES.PX,
            },
            animatedBlock: {
                backgroundColor: COLORS.BRAND.Secondary,
                width: '100%',
                borderRadius: SIZES.PX * 20,
                position: 'absolute',
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
            },
        })

        useEffect(() => {
            const px = (SELECTOR_HEIGHT * SIZES.PX) / MAX_LITERS

            const value = +litersValue * px
            if (value > SELECTOR_HEIGHT) {
                rHeight.value = SELECTOR_HEIGHT * SIZES.PX
            } else if (value < 0) {
                rHeight.value = 0
            } else {
                rHeight.value = value * SIZES.PX
            }
            setheight(+litersValue)
        }, [litersValue])

        return (
            <View style={styles.wrapper}>
               

                <GestureDetector gesture={PanGeture}>
                    <View style={styles.container}>
                        <AnimatedLinearGradient
                            colors={[
                                COLORS.BRAND.Tertiary,
                                COLORS.BRAND.Primary,
                            ]}
                            style={[styles.animatedBlock, rStyle]}
                        ></AnimatedLinearGradient>
                        <Typography type="bodyAccentMedium">
                            {height}
                        </Typography>
                    </View>
                </GestureDetector>
                {/* <View style={styles.right}>
                    <FuelLitersSelectorLitersBlock
                        onPressOnPlus={handlePressOnPlus}
                        onPressOnMinus={handlePressOnMinus}
                        liters={height}
                    />
                </View> */}
            </View>
        )
    }
)
