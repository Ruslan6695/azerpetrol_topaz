import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, useAnimatedValue } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { FuelLitersSelectorTick } from './FuelLitersSelectorTick'
import ScrollSvg from '../assets/scroll.svg'
type Props = {
    litersValue: string
    onChangeLitersValue: (value: string) => void
}

export const FuelLitersSelector = memo(
    ({ litersValue, onChangeLitersValue }: Props) => {
        const rHeight = useSharedValue(0)
        const [height, setheight] = useState(0)
        const context = useSharedValue({ y: 0 })
        const liters = useMemo(() => {
            return [60, 50, 40, 30, 20, 10]
        }, [])

        const rStyle = useAnimatedStyle(() => {
            return { height: rHeight.value }
        }, [])

        const handleSetLiters = useCallback((val: number) => {
            onChangeLitersValue(String(val))
        }, [])
        const handleSetHeight = useCallback((val: number) => {
            setheight(Math.round((val / (SIZES.PX * 240)) * 60))
        }, [])

        const handlePressOnTick = useCallback((liters: number) => {
            rHeight.value = liters * 4 * SIZES.PX
            onChangeLitersValue(String(liters))
            setheight(liters)
        }, [])

        const PanGeture = Gesture.Pan()
            .onStart((event) => {
                context.value = { y: rHeight.value }
            })
            .onChange((e) => {
                const value = -e.translationY + context.value.y
                if (value >= 0 && value < 240 * SIZES.PX) {
                    rHeight.value = -e.translationY + context.value.y
                    runOnJS(handleSetHeight)(value)
                } else if (value < 0) {
                    runOnJS(handleSetHeight)(0)
                } else if (value > 240 * SIZES.PX) {
                    runOnJS(handleSetHeight)(240 * SIZES.PX)
                }
            })
            .onEnd((e) => {
                const value = -e.translationY + context.value.y

                if (value >= 0 && value < 240 * SIZES.PX) {
                    runOnJS(handleSetLiters)(height)
                } else if (value < 0) {
                    runOnJS(handleSetLiters)(height)
                } else if (value > 240) {
                    runOnJS(handleSetLiters)(height)
                }
            })

        useEffect(() => {
            const value = +litersValue * 4
            if (value > 240) {
                rHeight.value = 240
                setheight(60)
            } else if (value < 0) {
                rHeight.value = 0
                setheight(value / 4)
            } else {
                rHeight.value = value * SIZES.PX
                setheight(value / 4)
            }
        }, [litersValue])

        return (
            <View style={styles.wrapper}>
                <GestureDetector gesture={PanGeture}>
                    <View style={styles.container}>
                        <View style={styles.litersText}>
                            {height > 0 ? (
                                <CustomText fz={30} white>
                                    {height}
                                </CustomText>
                            ) : (
                                <ScrollSvg
                                    width={SIZES.PX * 70}
                                    height={SIZES.PX * 70}
                                />
                            )}
                        </View>

                        <Animated.View
                            style={[styles.animatedBlock, rStyle]}
                        ></Animated.View>
                    </View>
                </GestureDetector>

                <View style={styles.litersBlock}>
                    {liters.map((liter) => (
                        <FuelLitersSelectorTick
                            onPress={handlePressOnTick}
                            liters={liter}
                            key={liter}
                            currentHeight={30}
                        />
                    ))}
                </View>
            </View>
        )
    }
)

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
    },
    container: {
        backgroundColor: COLORS.PURPLE_3,
        height: 240 * SIZES.PX,
        width: 100 * SIZES.PX,
        borderRadius: SIZES.PX * 20,
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    litersBlock: {
        justifyContent: 'space-between',
        marginLeft: SIZES.PX * 15,
    },
    animatedBlock: {
        backgroundColor: COLORS.PURPLE,
        width: '100%',
        borderRadius: SIZES.PX * 20,
        position: 'absolute',
        bottom: 0,
    },
    litersText: {
        width: '100%',
        height: '100%',

        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
