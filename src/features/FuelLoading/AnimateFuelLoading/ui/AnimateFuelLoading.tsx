import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'
import { COLORS, IAzs, IColumn, ITrkType, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
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
    const containerMarginTop = useSharedValue(0)
    const rotateFirst = useSharedValue(-50)
    const rotateSecond = useSharedValue(110)
    const rotateThree = useSharedValue(0)
    const [isShowAnimation, setIsShowAnimation] = useState(false)
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
        return { marginTop: SIZES.PX * 2600 - containerMarginTop.value * 16.3 }
    }, [])

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
        if (volume === 0) {
            setIsShowAnimation(true)
        }
    }, [volume])
    return (
        <View style={styles.main}>
            <View style={styles.absoluteObject}>
                <CustomText textAlign="center" fz={22} white>
                    НАЛИВ ТОПЛИВА
                </CustomText>
                <View style={styles.content}>
                    <CustomText
                        textAlign="center"
                        marginsPaddings={{ mb: 20 }}
                        fw="500"
                        white
                        fz={50}
                    >
                        {trkType?.name}
                    </CustomText>
                    <CustomText
                        textAlign="center"
                        marginsPaddings={{ mb: 20 }}
                        white
                        fz={20}
                    >
                        Идет налив топлива...
                    </CustomText>
                    <CustomText fw="600" textAlign="center" white fz={50}>
                        {isShowAnimation ? Math.round(percent) : 0} %
                    </CustomText>
                </View>

                <CustomText white fz={20}>
                    ИДЕТ НАЛИВ{' '}
                </CustomText>
                <View style={styles.row}>
                    {trkType && (
                        <CustomText
                            marginsPaddings={{ mt: 10, mb: 2 }}
                            white
                            fw="600"
                            fz={40}
                        >
                            {isShowAnimation
                                ? volume
                                    ? volume.toFixed(2)
                                    : 0
                                : 0}{' '}
                            / {liters} л
                        </CustomText>
                    )}
                </View>

                <View style={styles.row}>
                    {trkType && (
                        <CustomText white fw="600" fz={25}>
                            {isShowAnimation
                                ? (volume ? volume * trkType.price : 0).toFixed(
                                      2
                                  )
                                : 0}{' '}
                            / {rubles} ₽
                        </CustomText>
                    )}
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
        </View>
    )
}
const value = 4
const styles = StyleSheet.create({
    main: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: COLORS.GRAY,
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
        backgroundColor: '#79A314',
        width: SIZES.PX * 200 * value,
        height: SIZES.PX * 200 * value,
        borderRadius: SIZES.PX * 88 * value,
        top: 0,
    },
    waveTwo: {
        opacity: 0.5,
        backgroundColor: '#95C12B',
        top: SIZES.PX * -210 * value,
        height: SIZES.PX * 220 * value,
    },
    waveThree: {
        opacity: 0.5,
        backgroundColor: '#95C12B',
        top: SIZES.PX * -430 * value,
    },
})
