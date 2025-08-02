import { useRouter } from 'expo-router'
import { memo, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { FuelLoadingEndInfoItem } from '../../../../entities/FuelLoadingEndInfoItem'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { SuccessImage } from '../../../../shared/SuccessImage'

type Props = {
    rubles: number
    volume: number
    balance: number
}

export const FuelLoadingEndWidget = memo(
    ({ balance, rubles, volume }: Props) => {
        const router = useRouter()
        const iconTranslateX = useSharedValue(-500)
        const infoTranslateX = useSharedValue(500)

        const iconAnimStyle = useAnimatedStyle(() => {
            return { transform: [{ translateX: iconTranslateX.value }] }
        }, [])
        const infoAnimStyle = useAnimatedStyle(() => {
            return { transform: [{ translateX: infoTranslateX.value }] }
        }, [])

        useEffect(() => {
            setTimeout(() => {
                router.navigate(ESCREENS.HOME)
            }, 6000)
            iconTranslateX.value = withSpring(0, { damping: 12 })
            infoTranslateX.value = withSpring(0, { damping: 12 })
        })
        return (
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <Animated.View style={iconAnimStyle}>
                        <SuccessImage width={200} height={125} />
                        <CustomText
                            textAlign="center"
                            marginsPaddings={{ mt: 30 }}
                            fw="700"
                            fz={23}
                        >
                            НАЛИВ ЗАВЕРШЕН!
                        </CustomText>
                    </Animated.View>
                </View>
                <Animated.View
                    style={[
                        infoAnimStyle,
                        { width: '100%', alignItems: 'center' },
                    ]}
                >
                    <FuelLoadingEndInfoItem
                        info={`${rubles.toFixed(2)} ₽`}
                        title="Списано"
                    />
                    <FuelLoadingEndInfoItem
                        info={`${volume.toFixed(2)} ₽`}
                        title="Заправлено"
                    />
                    <FuelLoadingEndInfoItem
                        info={`${balance.toFixed(2)} ₽`}
                        title="Остаток"
                    />
                    <CustomText
                        textAlign="center"
                        fz={18}
                        marginsPaddings={{ mt: 30 }}
                        fw="500"
                    >
                        СПАСИБО ЗА ТО ЧТО ВЫ C НАМИ
                    </CustomText>
                </Animated.View>
            </View>
        )
    }
)

const styles = StyleSheet.create({
    wrapper: {
        width: SIZES.WIDTH(1),
        height: SIZES.HEIGHT(1),
        backgroundColor: COLORS.WHITE,
        paddingVertical: SIZES.PX * 40,
        paddingHorizontal: SIZES.PX * 20,
        alignItems: 'center',
        justifyContent: 'center',
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
})
