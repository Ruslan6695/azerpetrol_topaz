import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { ThemeStore } from '../../common/model/themeStore'

type Props = {
    width: number
    height?: number
    style?: any
    margins?: IMarginsPaddings
}

// Шиммер макета: градиент glass → glass2 → glass шириной 720,
// проезжающий от -360 до 360 за 1.1 с линейно.
const SWEEP = 360 * SIZES.PX
const GRADIENT_WIDTH = 720 * SIZES.PX

function Skeleton({ width, height, style, margins }: Props) {
    const COLORS = ThemeStore.useCOLORS()
    const linearColors: readonly [string, string, ...string[]] = useMemo(() => {
        return [COLORS.GLASS.Primary, COLORS.GLASS.Secondary, COLORS.GLASS.Primary]
    }, [COLORS])
    const translateX = useRef(new Animated.Value(-SWEEP)).current

    useEffect(() => {
        translateX.setValue(-SWEEP)
        const animation = Animated.loop(
            Animated.timing(translateX, {
                toValue: SWEEP,
                useNativeDriver: true,
                duration: 1100,
                easing: Easing.linear,
            })
        )
        animation.start()
        return () => animation.stop()
    }, [translateX])

    return (
        <View
            style={StyleSheet.flatten([
                {
                    width: width,
                    height: height,
                    overflow: 'hidden',
                    borderRadius: RADII.INPUT * SIZES.PX,
                    backgroundColor: COLORS.GLASS.Primary,
                    marginTop: margins?.mt ? margins?.mt * SIZES.PX : 0,
                    marginBottom: margins?.mb ? margins?.mb * SIZES.PX : 0,
                    marginRight: margins?.mr ? margins?.mr * SIZES.PX : 0,
                    marginLeft: margins?.ml ? margins?.ml * SIZES.PX : 0,
                },
                style,
            ])}
        >
            <Animated.View
                style={{
                    width: GRADIENT_WIDTH,
                    height: '100%',
                    transform: [{ translateX: translateX }],
                }}
            >
                <LinearGradient
                    style={{ width: '100%', height: '100%' }}
                    colors={linearColors}
                    locations={[0.25, 0.4, 0.55]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />
            </Animated.View>
        </View>
    )
}

export default Skeleton
