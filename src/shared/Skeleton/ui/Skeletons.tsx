import React, { useRef, useEffect, useMemo } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SIZES } from '../../common/config/constants/sizes'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { ThemeStore } from '../../common/model/themeStore'
import { EColorThemes } from '../../common/config/enums/EColorThemes'
type Props = {
    width: number
    height?: number
    style?: any
    margins?: IMarginsPaddings
}

function Skeleton({ width, height, style, margins }: Props) {
    const colorTheme = ThemeStore.useTheme()
    const COLORS = ThemeStore.useCOLORS()
    const linearColors: readonly [string, string, ...string[]] = useMemo(() => {
        return [COLORS.BACKGROUND.Primary, COLORS.BACKGROUND.Tertiary]
    }, [COLORS])
    const translateX = useRef(new Animated.Value(-width)).current
    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: width,
                useNativeDriver: true,
                duration: 2000,
            })
        ).start()
    }, [width])
    return (
        <View
            style={StyleSheet.flatten([
                {
                    width: width,
                    height: height,
                    overflow: 'hidden',
                    borderRadius: 15 * SIZES.PX,
                    backgroundColor:
                        colorTheme === EColorThemes.LIGHT
                            ? '#F6F9FC'
                            : COLORS.BACKGROUND.Tertiary,
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
                    width: '100%',
                    height: '100%',
                    transform: [{ translateX: translateX }],
                }}
            >
                <LinearGradient
                    style={{ width: '100%', height: '100%' }}
                    colors={linearColors}
                    start={{ x: 1, y: 1 }}
                />
            </Animated.View>
        </View>
    )
}

export default Skeleton
