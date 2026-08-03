import { memo, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'

type BlobProps = {
    color: string
    opacity: number
    size: number
    duration: number
    reverse?: boolean
}

// Размытие блоба сделано рампой прозрачности радиального градиента,
// а НЕ SVG-фильтром: <FeGaussianBlur> в react-native-svg 15 нестабилен
// на Android/New Arch и дорог. По сплошному кругу результат визуально
// неотличим от blur(30px) и стоит один статический <Svg>. Не «чинить».
const Blob = memo(({ color, opacity, size, duration, reverse }: BlobProps) => {
    const progress = useSharedValue(0)

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, {
                duration,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        )
    }, [progress, duration])

    const animatedStyle = useAnimatedStyle(() => {
        const from = reverse ? 1 : 0
        const to = reverse ? 0 : 1
        return {
            transform: [
                {
                    translateX: interpolate(
                        progress.value,
                        [0, 1],
                        [from * 24 * SIZES.PX, to * 24 * SIZES.PX]
                    ),
                },
                {
                    translateY: interpolate(
                        progress.value,
                        [0, 1],
                        [from * -18 * SIZES.PX, to * -18 * SIZES.PX]
                    ),
                },
                {
                    scale: interpolate(
                        progress.value,
                        [0, 1],
                        [1 + from * 0.12, 1 + to * 0.12]
                    ),
                },
            ],
        }
    })

    const gradientId = `blob-${color.replace('#', '')}-${size}`
    const half = size / 2

    return (
        <Animated.View style={animatedStyle}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Defs>
                    <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                        <Stop
                            offset="0%"
                            stopColor={color}
                            stopOpacity={opacity}
                        />
                        <Stop
                            offset="40%"
                            stopColor={color}
                            stopOpacity={opacity * 0.53}
                        />
                        <Stop offset="70%" stopColor={color} stopOpacity={0} />
                    </RadialGradient>
                </Defs>
                <Circle
                    cx={half}
                    cy={half}
                    r={half}
                    fill={`url(#${gradientId})`}
                />
            </Svg>
        </Animated.View>
    )
})

// Амбиентный фон макета: три медленно дрейфующих размытых пятна позади контента.
// Заменяет BackgroundImage в лэйаутах; сам BackgroundImage остаётся для экранов,
// где он используется как декор.
export const AmbientBackground = memo(() => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        blobA: {
            position: 'absolute',
            top: -120 * SIZES.PX,
            left: -80 * SIZES.PX,
        },
        blobB: {
            position: 'absolute',
            top: 180 * SIZES.PX,
            right: -120 * SIZES.PX,
        },
        blobC: {
            position: 'absolute',
            bottom: 120 * SIZES.PX,
            left: -100 * SIZES.PX,
        },
    })

    return (
        <>
            <Animated.View pointerEvents="none" style={styles.blobA}>
                <Blob
                    color={COLORS.AMBIENT.BlobA}
                    opacity={COLORS.AMBIENT.BlobAOpacity}
                    size={340 * SIZES.PX}
                    duration={9000}
                />
            </Animated.View>
            <Animated.View pointerEvents="none" style={styles.blobB}>
                <Blob
                    color={COLORS.AMBIENT.BlobB}
                    opacity={COLORS.AMBIENT.BlobBOpacity}
                    size={300 * SIZES.PX}
                    duration={11000}
                    reverse
                />
            </Animated.View>
            <Animated.View pointerEvents="none" style={styles.blobC}>
                <Blob
                    color={COLORS.AMBIENT.BlobC}
                    opacity={COLORS.AMBIENT.BlobCOpacity}
                    size={280 * SIZES.PX}
                    duration={13000}
                />
            </Animated.View>
        </>
    )
})
