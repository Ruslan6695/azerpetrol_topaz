import { memo, useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { SIZES, ThemeStore } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'

type Props = {
    liters: number
    rubles: number | string
}

export const FuelLoadingFuellingTotals = memo(({ liters, rubles }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const bottomValue = useSharedValue(-150)
    const animStyle = useAnimatedStyle(() => {
        return { bottom: bottomValue.value }
    }, [])
    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                position: 'absolute',
                backgroundColor: COLORS.BACKGROUND.Primary,
                padding: SIZES.PX * 16,
                borderRadius: SIZES.PX * 16,
                width: SIZES.WIDTH(1) - 40 * SIZES.PX,
                height: 100 * SIZES.PX,
                flexDirection: 'row',
            },
            infoBlock: {
                flex: 1,
            },
            line: {
                backgroundColor: COLORS.BACKGROUND.Secondary,
                width: 1 * SIZES.PX,
                height: '100%',
                marginHorizontal: SIZES.PX * 16,
            },
        })
    }, [COLORS])

    useEffect(() => {
        bottomValue.value = withSpring(40)
    }, [])
    return (
        <Animated.View style={[styles.container, animStyle]}>
            <View style={styles.infoBlock}>
                <Typography marginsPaddings={{ mb: 4 }}>Литры</Typography>
                <Typography type="displayMedium">{liters}</Typography>
            </View>
            <View style={styles.line}></View>
            <View style={styles.infoBlock}>
                <Typography marginsPaddings={{ mb: 4 }}>Сумма</Typography>
                <Typography type="displayMedium">{rubles}</Typography>
            </View>
        </Animated.View>
    )
})
