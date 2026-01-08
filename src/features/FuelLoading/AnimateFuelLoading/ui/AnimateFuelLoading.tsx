import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'
import { FuelLoadingFuellingTotals } from '../../../../entities/FuelLoading/FuelLoadingFuellingTotals'
import { ITrkType, SIZES, ThemeStore } from '../../../../shared'
import { BackgroundImage } from '../../../../shared/BackgroundImage'
import { Typography } from '../../../../shared/Typography'
type Props = {
    trkType: ITrkType | null
    liters: number
    rubles: number
    percent: number
    volume?: number
}

export const AnimateFuelLoading = ({
    trkType,
    percent,
    volume,
    liters,
    rubles,
}: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const containerMarginTop = useSharedValue(100)
    const rotateFirst = useSharedValue(-50)
    const rotateSecond = useSharedValue(110)
    const rotateThree = useSharedValue(0)
    const [isShowAnimation, setIsShowAnimation] = useState(true)
    const secondCircleAnSt = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: rotateSecond.value + 'deg' }],
        }
    }, [])

    const firstCirlceAnStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: rotateFirst.value + 'deg' }],
        }
    }, [])
    const threeCircleAnStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: rotateThree.value + 'deg' }],
        }
    }, [])
    //@ts-ignore
    const containerAnStyle = useAnimatedStyle(() => {
        return { marginTop: SIZES.PX * 3600 - containerMarginTop.value * 16.3 }
    }, [])
    const value = 4
    const styles = useMemo(() => {
        return StyleSheet.create({
            main: {
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: COLORS.BACKGROUND.Primary,
            },
            absoluteObject: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
                paddingVertical: SIZES.PX * 60,
                paddingHorizontal: SIZES.PX * 20,
            },
            content: {
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
            },
            row: {
                flexDirection: 'row',
                alignItems: 'center',
            },

            baseBox: {
                transform: [{ scale: 1.1 }],
                borderRadius: SIZES.PX * 20,
            },
            box: {
                width: SIZES.PX * 200 * value,
                height: SIZES.PX * 250 * value,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: SIZES.PX * 20,
            },
            waveOne: {
                opacity: 0.8,
                bottom: 0,
                backgroundColor: COLORS.BRAND.Primary,
                width: SIZES.PX * 200 * value,
                height: SIZES.PX * 200 * value,
                borderRadius: SIZES.PX * 88 * value,
                top: 0,
            },
            waveTwo: {
                opacity: 0.5,
                backgroundColor: COLORS.BRAND.Secondary,
                top: SIZES.PX * -210 * value,
                height: SIZES.PX * 220 * value,
            },
            waveThree: {
                opacity: 0.5,
                backgroundColor: COLORS.BRAND.Tertiary,
                top: SIZES.PX * -430 * value,
            },
        })
    }, [COLORS])

    useEffect(() => {
        rotateFirst.value = withRepeat(
            withTiming(360, { duration: 9000 }),
            -1,
            true
        )
        rotateSecond.value = withRepeat(
            withTiming(360, { duration: 5000 }),
            -1,
            true
        )
        rotateThree.value = withRepeat(
            withTiming(360, { duration: 7000 }),
            -1,
            true
        )
    }, [])
    useEffect(() => {
        containerMarginTop.value = withTiming(percent, { duration: 300 })
        /*  if (volume === 0) { */
        setIsShowAnimation(true)
    }, [volume])
    return (
        <View style={styles.main}>
            <BackgroundImage bottom={100} right={10} />
            <View style={styles.absoluteObject}>
                <View style={styles.content}>
                    <Typography
                        type="displayLarge"
                        textAlign="center"
                        marginsPaddings={{ mb: 8, mt: 34 }}
                    >
                        {trkType?.name}
                    </Typography>

                    <Typography
                        type="bodyMedium"
                        textAlign="center"
                        marginsPaddings={{ mb: 8 }}
                    >
                        Идет налив топлива...
                    </Typography>
                    <Typography type="displayLarge" textAlign="center">
                        {isShowAnimation ? Math.round(percent) : 0} %
                    </Typography>
                </View>
            </View>

            {isShowAnimation && (
                <Animated.View style={[styles.baseBox, containerAnStyle]}>
                    <View style={styles.box}>
                        <Animated.View
                            style={[styles.waveOne, firstCirlceAnStyle]}
                        ></Animated.View>
                        <Animated.View
                            style={[
                                styles.waveOne,
                                styles.waveTwo,
                                secondCircleAnSt,
                            ]}
                        ></Animated.View>
                        <Animated.View
                            style={[
                                styles.waveOne,
                                styles.waveThree,
                                threeCircleAnStyle,
                            ]}
                        ></Animated.View>
                    </View>
                </Animated.View>
            )}
            <FuelLoadingFuellingTotals
                liters={volume || 0}
                rubles={rubles.toFixed(2)}
            />
        </View>
    )
}
