import { useFocusEffect, useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { ESCREENS, SIZES, TSuccessScreenParams } from '../../../shared'
import { SuccessImage } from '../../../shared/SuccessImage'
import { Typography } from '../../../shared/Typography'
type Props = {
    params: Partial<TSuccessScreenParams>
}

export const SuccessWidget = memo(({ params }: Props) => {
    const router = useRouter()
    const iconTranslateX = useSharedValue(-500)
    const textTranslateX = useSharedValue(500)

    const iconAnimStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: iconTranslateX.value }] }
    }, [])
    const textAnimStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: textTranslateX.value }] }
    }, [])

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                router.navigate(params.link || ESCREENS.HOME)
            }, 3000)

            iconTranslateX.value = withSpring(0, { damping: 50 })
            textTranslateX.value = withSpring(0, { damping: 50 })
        }, [])
    )
    return (
        <View style={styles.container}>
            <Animated.View style={iconAnimStyle}>
                <SuccessImage />
            </Animated.View>
            <Animated.View style={textAnimStyle}>
                <Typography
                    type="headlineSmall"
                    style={styles.text}
                    marginsPaddings={{ mt: 30 }}
                    textAlign="center"
                    color="success"
                >
                    {params.text?.toUpperCase()}
                </Typography>
            </Animated.View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        width: SIZES.WIDTH(0.9),
        height: SIZES.HEIGHT(1) - 200 * SIZES.PX,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        maxWidth: SIZES.WIDTH(0.8),
    },
})
