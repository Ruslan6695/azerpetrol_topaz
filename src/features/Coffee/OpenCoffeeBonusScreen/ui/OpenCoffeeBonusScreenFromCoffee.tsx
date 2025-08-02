import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import GiftSvg from '../assets/gift.svg'
import { CustomText } from '../../../../shared/CustomText'
import {
    CustomButton,
    ECustomButtonTypes,
} from '../../../../shared/CustomButton'
import { useRouter } from 'expo-router'
type Props = {
    count: number
    coffeeMachineId?: number
}

export const OpenCoffeeBonusScreenFromCoffee = memo(
    ({ count, coffeeMachineId }: Props) => {
        const router = useRouter()
        const handlePress = useCallback(() => {
            router.navigate({
                pathname: ESCREENS.COFFEE_BONUS,
                params: { coffee_machine_id: coffeeMachineId },
            })
        }, [coffeeMachineId])
        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    <CustomText fw="300" fz={20} white>
                        Мы дарим вам
                    </CustomText>
                    <CustomText fz={20} white fw="600">
                        КОФЕ В ПОДАРОК
                    </CustomText>
                    <CustomButton
                        onPress={handlePress}
                        styled={{
                            activeOpacity: 0.9,
                            fz: 20,
                            type: ECustomButtonTypes.WHITE,
                            marginsPaddings: { mt: 10 },
                            width: { value: 200, type: 'px' },
                            height: { type: 'px', value: 50 },
                            textColor: 'rgba(255, 107, 0, 1)',
                            fw: '700',
                        }}
                    >
                        ВЫБРАТЬ
                    </CustomButton>
                </View>
                <View style={styles.right}>
                    <GiftSvg width={SIZES.PX * 61} height={SIZES.PX * 61} />
                    <CustomText
                        marginsPaddings={{ mt: 10 }}
                        fz={22}
                        fw="600"
                        white
                    >
                        + {count}
                    </CustomText>
                </View>
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 107, 0, 1)',
        borderRadius: SIZES.PX * 15,
        padding: SIZES.PX * 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.PX * 10,
        width: '100%',
    },
    left: {
        flex: 1,
    },
    right: {
        alignItems: 'center',
    },
})
