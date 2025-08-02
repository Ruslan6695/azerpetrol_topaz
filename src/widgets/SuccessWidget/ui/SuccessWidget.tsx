import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, ESCREENS, SIZES, TSuccessScreenParams } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { useFocusEffect, useRouter } from 'expo-router'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { SuccessImage } from '../../../shared/SuccessImage'
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
            }, 2000)

            iconTranslateX.value = withSpring(0, { damping: 12 })
            textTranslateX.value = withSpring(0, { damping: 12 })
        }, [])
    )
    return (
        <View style={styles.container}>
            <Animated.View style={iconAnimStyle}>
                <SuccessImage />
            </Animated.View>
            <Animated.View style={textAnimStyle}>
                <CustomText
                    style={styles.text}
                    marginsPaddings={{ mt: 30 }}
                    fw="700"
                    textAlign="center"
                    color={COLORS.GREEN}
                    fz={30}
                >
                    {params.text?.toUpperCase()}
                </CustomText>
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
